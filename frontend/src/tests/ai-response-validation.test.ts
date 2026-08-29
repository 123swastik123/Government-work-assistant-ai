import { AIResponseSchema } from "@/lib/ai/claude-client";

const valid = {
  reply_text: "Here is how to renew your driving licence.",
  matched_service_id: "123e4567-e89b-12d3-a456-426614174000",
  is_general_info: false,
  needs_follow_up: true,
  follow_up_question: "Is your licence currently expired?",
  defer_to_official_portal: false,
  suggest_for_review: null,
};

describe("AIResponseSchema", () => {
  it("accepts valid response",       () => { expect(AIResponseSchema.safeParse(valid).success).toBe(true); });
  it("rejects missing reply_text",   () => { const { reply_text: _, ...bad } = valid; void _; expect(AIResponseSchema.safeParse(bad).success).toBe(false); });
  it("rejects empty reply_text",     () => { expect(AIResponseSchema.safeParse({ ...valid, reply_text: "" }).success).toBe(false); });
  it("accepts null service_id",      () => { expect(AIResponseSchema.safeParse({ ...valid, matched_service_id: null }).success).toBe(true); });
  it("rejects non-boolean flag",     () => { expect(AIResponseSchema.safeParse({ ...valid, is_general_info: "yes" }).success).toBe(false); });
  it("accepts suggest_for_review",   () => {
    expect(AIResponseSchema.safeParse({ ...valid, suggest_for_review: { suggested_name: "BBMP Water Tax", suggested_category: "tax-finance" } }).success).toBe(true);
  });
  it("rejects empty suggested_name", () => {
    expect(AIResponseSchema.safeParse({ ...valid, suggest_for_review: { suggested_name: "", suggested_category: "tax" } }).success).toBe(false);
  });
  it("rejects wrong shape",          () => { expect(AIResponseSchema.safeParse({ wrong: "shape" }).success).toBe(false); });
  it("accepts all null optionals",   () => {
    expect(AIResponseSchema.safeParse({ ...valid, matched_service_id: null, follow_up_question: null, suggest_for_review: null }).success).toBe(true);
  });
});
