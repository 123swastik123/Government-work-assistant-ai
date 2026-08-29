import { normalizeInput, keywordMatch, assembleMatchResult, runKeywordPipeline } from "@/lib/ai/matching-pipeline";
import type { MatchCandidate } from "@/types";

const MOCK: Record<string, string> = {
  "aadhaar-update": "uuid-aadhaar-update",
  "aadhaar-new-enrollment": "uuid-aadhaar-new",
  "driving-licence-renewal": "uuid-dl-renewal",
  "learners-licence": "uuid-ll",
  "pan-card-new": "uuid-pan-new",
  "voter-id-new": "uuid-voter-new",
  "income-certificate": "uuid-income-cert",
  "birth-certificate": "uuid-birth-cert",
  "passport": "uuid-passport",
  "epf-uan-services": "uuid-epf",
};

describe("normalizeInput", () => {
  it("lowercases and trims", () => { expect(normalizeInput("  Driving LICENCE  ")).toBe("driving licence"); });
  it("preserves Devanagari", () => { expect(normalizeInput("आधार अपडेट")).toBe("आधार अपडेट"); });
  it("preserves Kannada", () => { expect(normalizeInput("ಚಾಲನಾ ಪರವಾನಗಿ")).toBe("ಚಾಲನಾ ಪರವಾನಗಿ"); });
});

describe("keywordMatch", () => {
  it("matches DL renewal", () => {
    expect(keywordMatch("dl renewal", MOCK).some((c: MatchCandidate) => c.service_slug === "driving-licence-renewal")).toBe(true);
  });
  it("matches Aadhaar update in Hindi", () => {
    expect(keywordMatch("आधार अपडेट", MOCK).some((c: MatchCandidate) => c.service_slug === "aadhaar-update")).toBe(true);
  });
  it("matches passport", () => {
    expect(keywordMatch("passport renewal", MOCK).some((c: MatchCandidate) => c.service_slug === "passport")).toBe(true);
  });
  it("exact match high score", () => {
    const match = keywordMatch("epf", MOCK).find((c: MatchCandidate) => c.service_slug === "epf-uan-services");
    expect(match).toBeDefined();
    expect(match!.score).toBeGreaterThan(50);
  });
});

describe("assembleMatchResult", () => {
  it("no match for empty", () => { expect(assembleMatchResult([]).matched).toBe(false); });
  it("high confidence for strong match", () => {
    const c: MatchCandidate[] = [{ service_id: "id1", service_slug: "driving-licence-renewal", name: "DL Renewal", score: 100, method: "exact", confidence: "high" }];
    expect(assembleMatchResult(c).matched).toBe(true);
  });
  it("requires clarification for ambiguous", () => {
    const c: MatchCandidate[] = [
      { service_id: "id1", service_slug: "driving-licence-renewal", name: "DL", score: 45, method: "keyword", confidence: "medium" },
      { service_id: "id2", service_slug: "learners-licence", name: "LL", score: 40, method: "keyword", confidence: "medium" },
    ];
    expect(assembleMatchResult(c).requires_clarification).toBe(true);
  });
});

describe("runKeywordPipeline", () => {
  it("renew licence", () => {
    const r = runKeywordPipeline("I want to renew my driving licence", MOCK);
    expect(r.matched).toBe(true);
    expect(r.service_slug).toBe("driving-licence-renewal");
  });
  it("income certificate", () => {
    expect(runKeywordPipeline("income certificate", MOCK).matched).toBe(true);
  });
  it("no match for gibberish", () => {
    expect(runKeywordPipeline("I want to fly to the moon", MOCK).matched).toBe(false);
  });
  it("Kannada DL", () => {
    expect(runKeywordPipeline("ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಣ", MOCK).matched).toBe(true);
  });
});
