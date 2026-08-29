// Server-only — Unified AI Provider Abstraction
// Active Provider: Google Gemini (Free tier)
// Future Provider: Anthropic Claude (Optional / Switchable via AI_PROVIDER=anthropic)
import { callGemini, buildFallbackResponse } from "./gemini-client";
import type { AIContextPayload } from "./system-prompt";
import type { AIResponse } from "@/types";

export type AIProvider = "gemini" | "anthropic";

export interface AIRequestOptions {
  payload: AIContextPayload;
  clientId: string;
}

export interface AIResponseResult {
  success: boolean;
  response?: AIResponse;
  error?: string;
  rateLimited?: boolean;
  retryAfter?: number;
  provider: AIProvider;
}

export async function generateAIResponse(options: AIRequestOptions): Promise<AIResponseResult> {
  const activeProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProvider) || "gemini";

  // Future option: If explicitly set to "anthropic" and ANTHROPIC_API_KEY is configured
  if (activeProvider === "anthropic") {
    try {
      const { callClaude } = await import("./claude-client");
      const claudeResult = await callClaude(options);
      return {
        ...claudeResult,
        provider: "anthropic",
      };
    } catch (err) {
      console.error("Anthropic provider error:", err);
      return {
        success: true,
        response: buildFallbackResponse(options.payload.language),
        provider: "anthropic",
      };
    }
  }

  // Active default provider: Google Gemini
  const geminiResult = await callGemini(options);
  return {
    ...geminiResult,
    provider: "gemini",
  };
}
