// ============================================================
// Government Work Helper — Claude API Client
// Server-only. Never import this in browser/client code.
// ============================================================

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { SYSTEM_PROMPT, buildUserMessage, buildConversationHistory } from "./system-prompt";
import type { AIContextPayload, ConversationTurn } from "./system-prompt";
import type { AIResponse } from "../frontend/src/types";

// ─── Zod schema for strict output validation ──────────────────
export const AIResponseSchema = z.object({
  reply_text: z.string().min(1),
  matched_service_id: z.string().nullable(),
  is_general_info: z.boolean(),
  needs_follow_up: z.boolean(),
  follow_up_question: z.string().nullable(),
  defer_to_official_portal: z.boolean(),
  suggest_for_review: z
    .object({
      suggested_name: z.string().min(1),
      suggested_category: z.string().min(1),
    })
    .nullable(),
});

// ─── Configuration ────────────────────────────────────────────
const MODEL = "claude-3-5-sonnet-20241022";
const MAX_TOKENS = 1024;
const TIMEOUT_MS = 30_000;
const MAX_RETRIES = 2;

// ─── Rate limit store (in-memory, per process) ────────────────
// For production, replace with Redis or Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RPM = parseInt(process.env.AI_RATE_LIMIT_RPM ?? "20", 10);

function checkRateLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const window = 60_000; // 1 minute
  const entry = rateLimitStore.get(clientId);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + window });
    return { allowed: true };
  }

  if (entry.count >= RATE_LIMIT_RPM) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }

  entry.count += 1;
  return { allowed: true };
}

// ─── Fallback response when AI is unavailable ─────────────────
function buildFallbackResponse(language: string): AIResponse {
  const messages: Record<string, string> = {
    en: "Our assistant is temporarily unavailable. You can still browse verified services below. Please try again in a moment.",
    hi: "हमारा सहायक अस्थायी रूप से अनुपलब्ध है। आप नीचे सत्यापित सेवाएं देख सकते हैं। कृपया थोड़ी देर बाद पुनः प्रयास करें।",
    kn: "ನಮ್ಮ ಸಹಾಯಕ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಕೆಳಗೆ ಪರಿಶೀಲಿಸಿದ ಸೇವೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಬಹುದು. ದಯವಿಟ್ಟು ಸ್ವಲ್ಪ ಸಮಯದ ನಂತರ ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ.",
  };
  return {
    reply_text: messages[language] ?? messages.en,
    matched_service_id: null,
    is_general_info: false,
    needs_follow_up: false,
    follow_up_question: null,
    defer_to_official_portal: false,
    suggest_for_review: null,
  };
}

// ─── Parse and validate Claude's JSON output ─────────────────
function parseClaudeResponse(raw: string): AIResponse {
  // Strip markdown fences if model accidentally adds them
  const cleaned = raw
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error(`Claude returned invalid JSON: ${cleaned.slice(0, 200)}`);
  }

  const result = AIResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(
      `Claude response failed schema validation: ${result.error.message}`
    );
  }

  return result.data;
}

// ─── Main AI call ─────────────────────────────────────────────
export interface ClaudeCallOptions {
  payload: AIContextPayload;
  clientId: string; // IP or user ID for rate limiting
}

export interface ClaudeCallResult {
  success: boolean;
  response?: AIResponse;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

export async function callClaude(options: ClaudeCallOptions): Promise<ClaudeCallResult> {
  const { payload, clientId } = options;

  // Rate limiting
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    return {
      success: false,
      rateLimited: true,
      retryAfter: rateCheck.retryAfter,
      error: "Rate limit exceeded",
    };
  }

  // Lazy-init client (ensures API key is read at call time, not module load)
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    return {
      success: true,
      response: buildFallbackResponse(payload.language),
    };
  }

  const client = new Anthropic({ apiKey });

  const userMessage = buildUserMessage(payload);
  const history = buildConversationHistory(payload.conversationHistory);

  // Build messages array for Claude
  const messages: Anthropic.MessageParam[] = [
    ...history.map((turn: ConversationTurn) => ({
      role: turn.role as "user" | "assistant",
      content: turn.content,
    })),
    { role: "user", content: userMessage },
  ];

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await Promise.race([
        client.messages.create({
          model: MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages,
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("Claude API timeout")), TIMEOUT_MS)
        ),
      ]);

      const textBlock = (response as Anthropic.Message).content.find(
        (b) => b.type === "text"
      );
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Claude returned no text content");
      }

      const aiResponse = parseClaudeResponse(textBlock.text);

      // Security: validate matched_service_id is not an arbitrary string
      // (full DB validation happens in the API route, but sanitize here too)
      if (aiResponse.matched_service_id) {
        const uuidRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(aiResponse.matched_service_id)) {
          aiResponse.matched_service_id = null;
        }
      }

      return { success: true, response: aiResponse };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));

      // Don't retry on rate limit or auth errors
      if (
        lastError.message.includes("rate_limit") ||
        lastError.message.includes("authentication") ||
        lastError.message.includes("permission")
      ) {
        break;
      }

      // Wait before retry (exponential backoff)
      if (attempt < MAX_RETRIES) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  console.error("Claude API failed after retries:", lastError?.message);

  // Return controlled fallback — never expose raw error to client
  return {
    success: true,
    response: buildFallbackResponse(payload.language),
  };
}
