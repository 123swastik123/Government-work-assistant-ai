// Server-only — Groq API client. Groq exposes an OpenAI-compatible endpoint.
import { AIResponseSchema } from "./gemini-client";
import { SYSTEM_PROMPT, buildUserMessage, buildConversationHistory } from "./system-prompt";
import type { AIContextPayload } from "./system-prompt";
import type { AIResponse } from "@/types";

const GROQ_MODEL = process.env.GROQ_MODEL || "qwen/qwen3.6-27b";
const TIMEOUT_MS = 20_000;
const MAX_RETRIES = 1;

export interface GroqCallOptions {
  payload: AIContextPayload;
  clientId: string;
}

export interface GroqCallResult {
  success: boolean;
  response?: AIResponse;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
}

function parseResponse(raw: string): AIResponse {
  const cleaned = raw.replace(/^```json\s*/i, "").replace(/^```\s*/i, "").replace(/```\s*$/i, "").trim();
  const result = AIResponseSchema.safeParse(JSON.parse(cleaned) as unknown);
  if (!result.success) throw new Error(`Groq schema validation failed: ${result.error.message}`);
  return result.data;
}

export async function callGroq(options: GroqCallOptions): Promise<GroqCallResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.includes("placeholder") || apiKey.includes("your-key")) {
    return { success: false, error: "Groq API key is not configured" };
  }

  const history = buildConversationHistory(options.payload.conversationHistory);
  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((turn) => ({ role: turn.role === "assistant" ? "assistant" : "user", content: turn.content })),
    { role: "user", content: buildUserMessage(options.payload) },
  ];
  const requestBody = {
    model: GROQ_MODEL,
    messages,
    response_format: { type: "json_object" },
    temperature: 0.2,
    max_completion_tokens: 1024,
  };

  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify(requestBody),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.status === 429) {
        const retryAfter = Number(response.headers.get("retry-after"));
        return { success: false, rateLimited: true, retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined, error: "Groq rate limit reached" };
      }
      if (!response.ok) throw new Error(`Groq API HTTP ${response.status}: ${await response.text().catch(() => "")}`);

      const data = await response.json() as { choices?: Array<{ message?: { content?: string | null } }> };
      const content = data.choices?.[0]?.message?.content;
      if (!content) throw new Error("Groq returned empty response text");
      return { success: true, response: parseResponse(content) };
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      if (attempt < MAX_RETRIES) await new Promise((resolve) => setTimeout(resolve, 750));
    }
  }

  console.error("Groq API failed:", lastError?.message);
  return { success: false, error: lastError?.message ?? "Groq request failed" };
}
