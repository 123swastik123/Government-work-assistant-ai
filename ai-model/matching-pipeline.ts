// ============================================================
// Government Work Helper — Service Matching Pipeline
//
// Stage 1: Normalize input
// Stage 2: Keyword / category matching
// Stage 3: pgvector semantic search (via Supabase RPC)
// Stage 4: Rank and select
// Stage 5: Clarification if ambiguous
//
// Intent matching happens BEFORE Claude's final guidance call.
// Claude explains; it does NOT decide which service matches.
// ============================================================

import type { MatchCandidate, MatchResult } from "../frontend/src/types";

// ─── Keyword synonyms ─────────────────────────────────────────
// Each entry maps a canonical service slug to keywords/phrases.
// This handles common misspellings, multilingual input, and synonyms.

const SERVICE_KEYWORD_MAP: Record<string, string[]> = {
  "aadhaar-new-enrollment": [
    "aadhaar", "aadhar", "aadhaar card", "aadhar card", "uid", "uidai",
    "biometric id", "new aadhaar", "enroll aadhaar", "aadhaar enrollment",
    "आधार", "आधार कार्ड", "ಆಧಾರ್", "ಆಧಾರ್ ಕಾರ್ಡ್",
  ],
  "aadhaar-update": [
    "aadhaar update", "aadhar update", "update aadhaar", "aadhaar correction",
    "aadhaar address change", "aadhaar name change", "aadhaar mobile update",
    "आधार अपडेट", "आधार सुधार", "ಆಧಾರ್ ನವೀಕರಣ", "ಆಧಾರ್ ಸುಧಾರಣೆ",
  ],
  "pan-card-new": [
    "pan", "pan card", "permanent account number", "income tax pan",
    "new pan", "apply pan", "get pan card",
    "पैन", "पैन कार्ड", "ಪ್ಯಾನ್", "ಪ್ಯಾನ್ ಕಾರ್ಡ್",
  ],
  "pan-card-correction": [
    "pan correction", "pan update", "pan name change", "pan card error",
    "fix pan", "correct pan", "pan card fix",
    "पैन सुधार", "ಪ್ಯಾನ್ ತಿದ್ದುಪಡಿ",
  ],
  "learners-licence": [
    "learner licence", "learner license", "ll", "learning licence",
    "learning license", "learner's licence", "learners license",
    "लर्नर लाइसेंस", "लर्नर्स लाइसेंस", "ಕಲಿಕಾ ಪರವಾನಗಿ",
  ],
  "permanent-driving-licence": [
    "driving licence", "driving license", "dl", "permanent dl",
    "permanent driving licence", "new driving licence",
    "ड्राइविंग लाइसेंस", "ड्राइविंग लाइसेंस नया", "ಚಾಲನಾ ಪರವಾನಗಿ", "ಹೊಸ DL",
  ],
  "driving-licence-renewal": [
    "dl renewal", "driving licence renewal", "renew dl", "renew driving licence",
    "driving license renewal", "expired dl", "dl expired", "licence renew",
    "ड्राइविंग लाइसेंस नवीनीकरण", "ड्राइविंग लाइसेंस renew",
    "ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಣ", "DL ನವೀಕರಣ",
  ],
  "voter-id-new": [
    "voter id", "voter card", "epic card", "voter registration", "voter id new",
    "register vote", "new voter", "election card", "vote card",
    "वोटर आईडी", "वोटर कार्ड", "ಮತದಾರ ಗುರುತುಪತ್ರ", "ಮತದಾರ ಕಾರ್ಡ್",
  ],
  "voter-id-correction": [
    "voter id correction", "voter card correction", "epic correction",
    "voter id name change", "voter id address change", "form 8",
    "वोटर आईडी सुधार", "ಮತದಾರ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ",
  ],
  "ration-card": [
    "ration card", "ration", "bpl card", "apl card", "food card",
    "ahara", "ration card new", "ration card update",
    "राशन कार्ड", "ਰਾਸ਼ਨ ਕਾਰਡ", "ಪಡಿತರ ಚೀಟಿ", "ಪಡಿತರ ಕಾರ್ಡ್",
  ],
  "income-certificate": [
    "income certificate", "income proof", "salary certificate",
    "annual income certificate", "nadakacheri income",
    "आय प्रमाणपत्र", "आय प्रमाण", "ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "caste-certificate": [
    "caste certificate", "sc certificate", "st certificate", "obc certificate",
    "community certificate", "caste proof",
    "जाति प्रमाणपत्र", "जाति प्रमाण", "ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "birth-certificate": [
    "birth certificate", "birth proof", "janma certificate", "born certificate",
    "जन्म प्रमाणपत्र", "जन्म प्रमाण", "ಜನನ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "death-certificate": [
    "death certificate", "death proof", "mrityu certificate",
    "मृत्यु प्रमाणपत्र", "मृत्यु प्रमाण", "ಮರಣ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "domicile-certificate": [
    "domicile certificate", "residence certificate", "nivaas certificate",
    "state certificate", "karnataka domicile",
    "अधिवास प्रमाणपत्र", "निवास प्रमाण", "ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "passport": [
    "passport", "new passport", "passport renewal", "travel document",
    "international travel", "passport application",
    "पासपोर्ट", "ಪಾಸ್‌ಪೋರ್ಟ್",
  ],
  "duplicate-driving-licence": [
    "duplicate dl", "lost dl", "duplicate driving licence", "lost driving licence",
    "stolen driving licence", "damaged dl",
    "डुप्लीकेट DL", "ಡುಪ್ಲಿಕೇಟ್ DL", "ಕಳೆದ DL",
  ],
  "dl-correction": [
    "dl address change", "driving licence address", "dl name change",
    "driving licence correction", "dl correction",
    "DL पता बदलें", "ಚಾಲನಾ ಪರವಾನಗಿ ವಿಳಾಸ ಬದಲಾವಣೆ",
  ],
  "legal-heir-certificate": [
    "legal heir", "legal heir certificate", "succession certificate",
    "heir certificate", "waris certificate", "inheritance",
    "कानूनी उत्तराधिकारी", "ಕಾನೂನು ವಾರಸುದಾರ",
  ],
  "non-creamy-layer-certificate": [
    "non creamy layer", "ncl certificate", "obc ncl", "creamy layer certificate",
    "non-creamy layer",
    "नॉन क्रीमी लेयर", "ನಾನ್ ಕ್ರೀಮಿ ಲೇಯರ್",
  ],
  "khata-certificate-transfer": [
    "khata", "khata certificate", "khata transfer", "bbmp khata",
    "khata extract", "property khata",
    "खाता", "ಖಾತಾ", "ಖಾತಾ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "property-tax-bbmp": [
    "property tax", "bbmp tax", "house tax", "property tax payment",
    "bbmp property", "pay property tax",
    "संपत्ति कर", "ಆಸ್ತಿ ತೆರಿಗೆ",
  ],
  "encumbrance-certificate": [
    "encumbrance certificate", "ec certificate", "property ec",
    "encumbrance", "kaveri ec",
    "भार प्रमाणपत्र", "ಅಡಮಾನ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "rtc-pahani": [
    "rtc", "pahani", "land record", "bhoomi rtc", "record of rights",
    "land document", "survey number record",
    "आरटीसी", "पहाणी", "ಆರ್‌ಟಿಸಿ", "ಪಹಾಣಿ",
  ],
  "vehicle-rc-new": [
    "vehicle registration", "new vehicle rc", "rc registration",
    "car registration", "bike registration", "rc new",
    "वाहन पंजीकरण", "ವಾಹನ ನೋಂದಣಿ",
  ],
  "vehicle-rc-transfer": [
    "rc transfer", "vehicle transfer", "ownership transfer rc",
    "second hand car", "used vehicle registration",
    "वाहन स्थानांतरण", "RC ವರ್ಗಾವಣೆ",
  ],
  "marriage-certificate": [
    "marriage certificate", "marriage registration", "vivah certificate",
    "wedding certificate", "marriage proof",
    "विवाह प्रमाणपत्र", "ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "police-clearance-certificate": [
    "police clearance", "pcc", "character certificate", "police certificate",
    "police verification certificate",
    "पुलिस क्लियरेंस", "ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್",
  ],
  "disability-certificate": [
    "disability certificate", "udid", "divyang certificate", "pwd certificate",
    "handicap certificate",
    "विकलांगता प्रमाणपत्र", "ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ",
  ],
  "epf-uan-services": [
    "epf", "pf", "epfo", "uan", "provident fund", "epf withdrawal",
    "pf withdrawal", "pf transfer", "pf balance",
    "EPF", "PF", "ಇಪಿಎಫ್", "ಪ್ರಾವಿಡೆಂಟ್ ಫಂಡ್",
  ],
};

// ─── Normalizer ───────────────────────────────────────────────

export function normalizeInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/[^\w\s\u0900-\u097F\u0C80-\u0CFF]/g, " ") // keep Devanagari + Kannada
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Keyword matching ─────────────────────────────────────────

export function keywordMatch(
  normalizedInput: string,
  serviceSlugToId: Record<string, string>
): MatchCandidate[] {
  const candidates: MatchCandidate[] = [];

  for (const [slug, keywords] of Object.entries(SERVICE_KEYWORD_MAP)) {
    const serviceId = serviceSlugToId[slug];
    if (!serviceId) continue;

    let score = 0;
    let method: MatchCandidate["method"] = "keyword";

    for (const keyword of keywords) {
      const kw = keyword.toLowerCase();
      if (normalizedInput === kw) {
        score += 100; // exact match
        method = "exact";
      } else if (normalizedInput.includes(kw) || kw.includes(normalizedInput)) {
        score += 50; // substring match
      } else {
        // Check for individual word overlaps
        const kwWords = kw.split(" ");
        const inputWords = normalizedInput.split(" ");
        const overlap = kwWords.filter((w) => inputWords.includes(w)).length;
        if (overlap > 0) {
          score += overlap * 15;
        }
      }
    }

    if (score > 0) {
      candidates.push({
        service_id: serviceId,
        service_slug: slug,
        name: slug.replace(/-/g, " "),
        score,
        method,
        confidence: score >= 80 ? "high" : score >= 30 ? "medium" : "low",
      });
    }
  }

  return candidates.sort((a, b) => b.score - a.score);
}

// ─── Result assembler ─────────────────────────────────────────

const HIGH_CONFIDENCE_THRESHOLD = 60;
const AMBIGUOUS_THRESHOLD = 30;

export function assembleMatchResult(
  candidates: MatchCandidate[],
  language = "en"
): MatchResult {
  if (candidates.length === 0) {
    return {
      matched: false,
      service_id: null,
      service_slug: null,
      confidence: null,
      candidates: [],
      method: null,
      requires_clarification: false,
      clarification_question: null,
    };
  }

  const top = candidates[0];

  // High confidence — clear winner
  if (top.score >= HIGH_CONFIDENCE_THRESHOLD) {
    return {
      matched: true,
      service_id: top.service_id,
      service_slug: top.service_slug,
      confidence: "high",
      candidates,
      method: top.method,
      requires_clarification: false,
      clarification_question: null,
    };
  }

  // Two or more candidates close together — ask for clarification
  const closeCompetitors = candidates.filter(
    (c) => c.score >= AMBIGUOUS_THRESHOLD && c.score >= top.score * 0.7
  );

  if (closeCompetitors.length >= 2) {
    const clarificationQuestions: Record<string, string> = {
      en: "I found a few services that might match. Could you tell me more about what you need?",
      hi: "मुझे कुछ सेवाएं मिलीं जो मेल खा सकती हैं। क्या आप बता सकते हैं कि आपको क्या चाहिए?",
      kn: "ನಾನು ಕೆಲವು ಸೇವೆಗಳನ್ನು ಕಂಡುಕೊಂಡಿದ್ದೇನೆ. ನಿಮಗೆ ಏನು ಬೇಕೆಂದು ಹೇಳಬಹುದೇ?",
    };

    return {
      matched: false,
      service_id: null,
      service_slug: null,
      confidence: "medium",
      candidates: closeCompetitors,
      method: "keyword",
      requires_clarification: true,
      clarification_question:
        clarificationQuestions[language] ?? clarificationQuestions.en,
    };
  }

  // Low confidence single match
  if (top.score >= AMBIGUOUS_THRESHOLD) {
    return {
      matched: true,
      service_id: top.service_id,
      service_slug: top.service_slug,
      confidence: "low",
      candidates,
      method: top.method,
      requires_clarification: false,
      clarification_question: null,
    };
  }

  // No usable match
  return {
    matched: false,
    service_id: null,
    service_slug: null,
    confidence: null,
    candidates,
    method: null,
    requires_clarification: false,
    clarification_question: null,
  };
}

// ─── Full pipeline (without Supabase — for unit testing) ──────

export function runKeywordPipeline(
  userInput: string,
  serviceSlugToId: Record<string, string>,
  language = "en"
): MatchResult {
  const normalized = normalizeInput(userInput);
  const candidates = keywordMatch(normalized, serviceSlugToId);
  return assembleMatchResult(candidates, language);
}
