import { AIResponseSchema as ClaudeSchema } from "@/lib/ai/claude-client";
import { AIResponseSchema as GeminiSchema, buildFallbackResponse } from "@/lib/ai/gemini-client";

const valid = {
  reply_text: "Here is how to renew your driving licence.",
  matched_service_id: "123e4567-e89b-12d3-a456-426614174000",
  is_general_info: false,
  needs_follow_up: true,
  follow_up_question: "Is your licence currently expired?",
  defer_to_official_portal: false,
  suggest_for_review: null,
};

describe("AIResponseSchema (Claude & Gemini)", () => {
  it("Claude schema accepts valid response", () => {
    expect(ClaudeSchema.safeParse(valid).success).toBe(true);
  });

  it("Gemini schema accepts valid response", () => {
    expect(GeminiSchema.safeParse(valid).success).toBe(true);
  });

  it("Gemini schema rejects missing reply_text", () => {
    const { reply_text: _, ...bad } = valid;
    void _;
    expect(GeminiSchema.safeParse(bad).success).toBe(false);
  });

  it("Gemini schema rejects empty reply_text", () => {
    expect(GeminiSchema.safeParse({ ...valid, reply_text: "" }).success).toBe(false);
  });

  it("Gemini schema accepts null service_id", () => {
    expect(GeminiSchema.safeParse({ ...valid, matched_service_id: null }).success).toBe(true);
  });

  it("Gemini schema rejects non-boolean flag", () => {
    expect(GeminiSchema.safeParse({ ...valid, is_general_info: "yes" }).success).toBe(false);
  });

  it("Gemini schema accepts suggest_for_review", () => {
    expect(
      GeminiSchema.safeParse({
        ...valid,
        suggest_for_review: {
          suggested_name: "BBMP Water Tax",
          suggested_category: "tax-finance",
        },
      }).success
    ).toBe(true);
  });

  it("Gemini fallback responses are valid across all languages", () => {
    const enFallback = buildFallbackResponse("en");
    const hiFallback = buildFallbackResponse("hi");
    const knFallback = buildFallbackResponse("kn");

    expect(GeminiSchema.safeParse(enFallback).success).toBe(true);
    expect(GeminiSchema.safeParse(hiFallback).success).toBe(true);
    expect(GeminiSchema.safeParse(knFallback).success).toBe(true);

    expect(enFallback.reply_text).toContain("temporarily unavailable");
    expect(hiFallback.reply_text).toContain("अनुपलब्ध");
    expect(knFallback.reply_text).toContain("ಲಭ್ಯವಿಲ್ಲ");
  });
});
