// Server-only — Unified AI Provider Abstraction
// Provider routing. Groq is the recommended default for this project;
// Gemini remains an automatic fallback when Groq is unavailable.
import { callGemini, buildFallbackResponse } from "./gemini-client";
import { callGroq } from "./groq-client";
import type { AIContextPayload } from "./system-prompt";
import type { AIResponse } from "@/types";

export type AIProvider = "groq" | "gemini" | "anthropic";

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
  const activeProvider = (process.env.AI_PROVIDER?.toLowerCase() as AIProvider) || "groq";

  if (activeProvider === "groq") {
    const groqResult = await callGroq(options);
    if (groqResult.success && groqResult.response) return { ...groqResult, provider: "groq" };

    // A provider failure or free-tier limit must not make the whole app fail.
    // Gemini is retained as a quiet fallback for the same request.
    console.warn("Groq unavailable; trying Gemini fallback:", groqResult.error);
    const geminiResult = await callGemini(options);
    return { ...geminiResult, provider: "gemini" };
  }

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
