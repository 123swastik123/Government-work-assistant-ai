// Server-only — Google Gemini API client. Never import in browser code.
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

// Keep a current stable server-side default. Vercel may override this with
// GEMINI_MODEL, but a missing variable must not fall back to a retired model.
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-3.6-flash";
const TIMEOUT_MS = 25_000;
const MAX_RETRIES = 2;

const rateLimitStore = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_RPM = parseInt(process.env.AI_RATE_LIMIT_RPM ?? "60", 10);

function checkRateLimit(clientId: string): { allowed: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = rateLimitStore.get(clientId);
  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(clientId, { count: 1, resetAt: now + 60_000 });
    return { allowed: true };
  }
  if (entry.count >= RATE_LIMIT_RPM) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) };
  }
  entry.count += 1;
  return { allowed: true };
}

export function buildFallbackResponse(language: string): AIResponse {
  const m: Record<string, string> = {
    en: "Our assistant is temporarily unavailable. You can still browse verified services below.",
    hi: "हमारा सहायक अस्थायी रूप से अनुपलब्ध है। आप नीचे सत्यापित सेवाओं को देख सकते हैं।",
    kn: "ನಮ್ಮ ಸಹಾಯಕ ತಾತ್ಕಾಲಿಕವಾಗಿ ಲಭ್ಯವಿಲ್ಲ. ನೀವು ಕೆಳಗಿನ ಪರಿಶೀಲಿಸಿದ ಸೇವೆಗಳನ್ನು ಬ್ರೌಸ್ ಮಾಡಬಹುದು.",
  };
  return {
    reply_text: m[language] ?? m.en,
    matched_service_id: null,
    is_general_info: false,
    needs_follow_up: false,
    follow_up_question: null,
    defer_to_official_portal: false,
    suggest_for_review: null,
  };
}

function parseGeminiResponse(raw: string): AIResponse {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  const parsed = JSON.parse(cleaned) as unknown;
  const result = AIResponseSchema.safeParse(parsed);
  if (!result.success) {
    throw new Error(`Gemini schema validation failed: ${result.error.message}`);
  }
  return result.data;
}

export interface GeminiCallOptions {
  payload: AIContextPayload;
  clientId: string;
}

export interface GeminiCallResult {
  success: boolean;
  response?: AIResponse;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

export async function callGemini(options: GeminiCallOptions): Promise<GeminiCallResult> {
  const { payload, clientId } = options;
  const rateCheck = checkRateLimit(clientId);
  if (!rateCheck.allowed) {
    return {
      success: false,
      rateLimited: true,
      retryAfter: rateCheck.retryAfter,
      error: "Rate limit exceeded",
    };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.includes("placeholder") || apiKey.includes("your-key")) {
    return { success: true, response: buildFallbackResponse(payload.language) };
  }

  const userMessage = buildUserMessage(payload);
  const history = buildConversationHistory(payload.conversationHistory);

  // Format contents for Google Gemini API
  const contents: Array<{ role: "user" | "model"; parts: Array<{ text: string }> }> = [];

  for (const turn of history) {
    contents.push({
      role: turn.role === "assistant" ? "model" : "user",
      parts: [{ text: turn.content }],
    });
  }

  // Current turn with complete structured context
  contents.push({
    role: "user",
    parts: [{ text: userMessage }],
  });

  const requestBody = {
    systemInstruction: {
      parts: [{ text: SYSTEM_PROMPT }],
    },
    contents,
    generationConfig: {
      responseMimeType: "application/json",
      temperature: 0.2,
      maxOutputTokens: 1024,
    },
  };

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        // Provider capacity is not a citizen's request-rate violation. Let the
        // route choose a verified service-guide fallback when one is available.
        if (res.status === 429) throw new Error("Gemini provider capacity reached");
        throw new Error(`Gemini API HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json() as {
        candidates?: Array<{
          content?: {
            parts?: Array<{ text?: string }>;
          };
        }>;
      };

      const candidate = data.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;
      if (!text) throw new Error("Gemini returned empty response text");

      const aiResponse = parseGeminiResponse(text);

      // Validate matched_service_id format if present
      if (aiResponse.matched_service_id) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        const slugPattern = /^[a-z0-9-]+$/i;
        if (!uuidRegex.test(aiResponse.matched_service_id) && !slugPattern.test(aiResponse.matched_service_id)) {
          aiResponse.matched_service_id = null;
        }
      }

      return { success: true, response: aiResponse };
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err));
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 1000 * Math.pow(2, attempt)));
      }
    }
  }

  console.error("Gemini API failed:", lastError?.message);
  return { success: true, response: buildFallbackResponse(payload.language) };
}
