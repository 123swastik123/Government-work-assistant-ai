// Server-only — Claude API client. Never import in browser code.
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserMessage, buildConversationHistory } from "./system-prompt";
import type { AIContextPayload, ConversationTurn } from "./system-prompt";
import type { AIResponse } from "@/types";

export const AIResponseSchema = z.object({
  reply_text: z.string().min(1),
  matched_service_id: z.string().nullable(),
  is_general_info: z.boolean(),
  needs_follow_up: z.boolean(),
  follow_up_question: z.string().nullable(),
  defer_to_official_portal: z.boolean(),
  suggest_for_review: z.object({ suggested_name: z.string().min(1), suggested_category: z.string().min(1) }).nullable(),
});

const MODEL = "claude-3-5-sonnet-20241022";
const MAX_TOKENS = 1024;
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RPM = parseInt(process.env.AI_RATE_LIMIT_RPM ?? "20", 10);

function checkRateLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);
  if (!entry || now > entry.resetAt) { rateLimitStore.set(clientId, { count: 1, resetAt: now + 60_000 }); return { allowed: true }; }
  if (entry.count >= RATE_LIMIT_RPM) return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  entry.count += 1;
  return { allowed: true };
}

function buildFallbackResponse(language: string): AIResponse {
  const m: Record<string, string> = {
    en: "Our assistant is temporarily unavailable. You can still browse verified services below.",
    hi: "हमारा सहायक अस्थायी रूप से अनुपलब्ध है।",
    kn: "ನಮ್ಮ ಸಹಾಯಕ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ.",
  };
  return { reply_text: m[language] ?? m.en, matched_service_id: null, is_general_info: false, needs_follow_up: false, follow_up_question: null, defer_to_official_portal: false, suggest_for_review: null };
}

function parseClaudeResponse(raw: string): AIResponse {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(cleaned) as unknown;
  const result = AIResponseSchema.safeParse(parsed);
  if (!result.success) throw new Error(`Schema validation failed: ${result.error.message}`);
  return result.data;
}

export interface ClaudeCallOptions { payload: AIContextPayload; clientId: string }
export interface ClaudeCallResult { success: boolean; response?: AIResponse; error?: string; rateLimited?: boolean; retryAfter?: number }

export async function callClaude(options: ClaudeCallOptions): Promise<ClaudeCallResult> {
  const { payload, clientId } = options;
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) return { success: false, rateLimited: true, retryAfter: rateCheck.retryAfter, error: "Rate limit exceeded" };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { success: true, response: buildFallbackResponse(payload.language) };

  const client = new Anthropic({ apiKey });
  const userMessage = buildUserMessage(payload);
  const history = buildConversationHistory(payload.conversationHistory);
  const messages: Anthropic.MessageParam[] = [
    ...history.map((t: ConversationTurn) => ({ role: t.role as "user" | "assistant", content: t.content })),
    { role: "user", content: userMessage },
  ];

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await Promise.race([
        client.messages.create({ model: MODEL, max_tokens: MAX_TOKENS, system: SYSTEM_PROMPT, messages }),
        new Promise<never>((_, reject) => setTimeout(() => reject(new Error("Timeout")), TIMEOUT_MS)),
      ]);
      const textBlock = (response as Anthropic.Message).content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") throw new Error("No text content");
      const aiResponse = parseClaudeResponse(textBlock.text);
      if (aiResponse.matched_service_id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(aiResponse.matched_service_id)) aiResponse.matched_service_id = null;
      }
      return { success: true, response: aiResponse };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (lastError.message.includes("rate_limit") || lastError.message.includes("authentication")) break;
      if (attempt < MAX_RETRIES) await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
    }
  }
  console.error("Claude API failed:", lastError?.message);
  return { success: true, response: buildFallbackResponse(payload.language) };
}
