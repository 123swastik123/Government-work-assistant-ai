import { evaluateEligibility, getApplicableDocuments, getNextQuestion } from "@/lib/ai/eligibility-engine";
import type { EligibilityRule, ServiceQuestion, DocumentRequirement } from "@/types";

describe("evaluateEligibility", () => {
  it("returns eligible when no rules defined", () => {
    expect(evaluateEligibility(null, {}).status).toBe("eligible");
  });

  it("returns eligible when condition met", () => {
    const rule: EligibilityRule = { field: "age_num", operator: "greater_than_or_equal", value: 18, message: "Must be 18+" };
    expect(evaluateEligibility(rule, { age_num: 25 }).status).toBe("eligible");
  });

  it("returns not_eligible when condition fails", () => {
    const rule: EligibilityRule = { field: "age_num", operator: "greater_than_or_equal", value: 18, message: "Must be 18+" };
    const result = evaluateEligibility(rule, { age_num: 15 });
    expect(result.status).toBe("not_eligible");
    expect(result.reasons).toContain("Must be 18+");
  });

  it("returns needs_information when field missing", () => {
    const rule: EligibilityRule = { field: "has_dl", operator: "equals", value: true, message: "Must have DL" };
    const result = evaluateEligibility(rule, {});
    expect(result.status).toBe("needs_information");
    expect(result.missing_fields).toContain("has_dl");
  });

  it("handles all group", () => {
    const rule: EligibilityRule = {
      all: [
        { field: "has_dl", operator: "equals", value: true, message: "Must have DL" },
        { field: "ll_days_held", operator: "greater_than_or_equal", value: 30, message: "Must hold LL 30+ days" },
      ],
    };
    expect(evaluateEligibility(rule, { has_dl: true, ll_days_held: 45 }).status).toBe("eligible");
    expect(evaluateEligibility(rule, { has_dl: true, ll_days_held: 10 }).status).toBe("not_eligible");
  });

  it("handles any group", () => {
    const rule: EligibilityRule = {
      any: [
        { field: "cat_a", operator: "equals", value: true },
        { field: "cat_b", operator: "equals", value: true },
      ],
    };
    expect(evaluateEligibility(rule, { cat_a: true, cat_b: false }).status).toBe("eligible");
    expect(evaluateEligibility(rule, { cat_a: false, cat_b: false }).status).toBe("not_eligible");
  });

  it("handles not_equals", () => {
    const rule: EligibilityRule = { field: "has_aadhaar", operator: "not_equals", value: true, message: "Must not have Aadhaar" };
    expect(evaluateEligibility(rule, { has_aadhaar: false }).status).toBe("eligible");
    expect(evaluateEligibility(rule, { has_aadhaar: true }).status).toBe("not_eligible");
  });

  it("handles not_in", () => {
    const rule: EligibilityRule = { field: "age_bracket", operator: "not_in", value: ["under_18"], message: "Must be 18+" };
    expect(evaluateEligibility(rule, { age_bracket: "18_25" }).status).toBe("eligible");
    expect(evaluateEligibility(rule, { age_bracket: "under_18" }).status).toBe("not_eligible");
  });
});

describe("getApplicableDocuments", () => {
  const required: DocumentRequirement[] = [
    { id: "aadhaar", name: { en: "Aadhaar", hi: "आधार", kn: "ಆಧಾರ್" }, status: "required" },
  ];
  const conditional: DocumentRequirement[] = [
    { id: "fir", name: { en: "FIR", hi: "एफआईआर", kn: "FIR" }, status: "conditional",
      required_when: { field: "reason", operator: "in", value: ["lost", "stolen"] } },
  ];

  it("always includes required", () => {
    expect(getApplicableDocuments(required, conditional, {}).some((d) => d.id === "aadhaar")).toBe(true);
  });
  it("includes conditional when condition met", () => {
    expect(getApplicableDocuments(required, conditional, { reason: "lost" }).some((d) => d.id === "fir")).toBe(true);
  });
  it("excludes conditional when condition not met", () => {
    expect(getApplicableDocuments(required, conditional, { reason: "damaged" }).some((d) => d.id === "fir")).toBe(false);
  });
});

describe("getNextQuestion", () => {
  const questions: ServiceQuestion[] = [
    { id: "q1", type: "boolean", label: { en: "Q1", hi: "Q1", kn: "Q1" }, required: true, eligibility_relevant: true },
    { id: "q2", type: "select", label: { en: "Q2", hi: "Q2", kn: "Q2" }, required: true, eligibility_relevant: false,
      show_when: { field: "q1", operator: "equals", value: true } },
  ];

  it("returns first unanswered", () => { expect(getNextQuestion(questions, {})?.id).toBe("q1"); });
  it("shows conditional when condition met", () => { expect(getNextQuestion(questions, { q1: true })?.id).toBe("q2"); });
  it("hides conditional when condition not met", () => { expect(getNextQuestion(questions, { q1: false })).toBeNull(); });
  it("returns null when all answered", () => { expect(getNextQuestion(questions, { q1: true, q2: "a" })).toBeNull(); });
});
