import type { MatchCandidate, MatchResult } from "@/types";

const SERVICE_KEYWORD_MAP: Record<string, string[]> = {
  "aadhaar-new-enrollment": ["aadhaar","aadhar","uid","uidai","biometric id","new aadhaar","aadhaar enrollment","आधार","आधार कार्ड","ಆಧಾರ್"],
  "aadhaar-update": ["aadhaar update","aadhar update","update aadhaar","aadhaar correction","aadhaar address change","aadhaar name change","आधार अपडेट","आधार सुधार","ಆಧಾರ್ ನವೀಕರಣ"],
  "pan-card-new": ["pan","pan card","permanent account number","income tax pan","new pan","apply pan","पैन","पैन कार्ड","ಪ್ಯಾನ್"],
  "pan-card-correction": ["pan correction","pan update","pan name change","pan card error","fix pan","पैन सुधार","ಪ್ಯಾನ್ ತಿದ್ದುಪಡಿ"],
  "learners-licence": ["learner licence","learner license","ll","learning licence","learner's licence","लर्नर लाइसेंस","ಕಲಿಕಾ ಪರವಾನಗಿ"],
  "permanent-driving-licence": ["driving licence","driving license","dl","permanent dl","permanent driving licence","new driving licence","ड्राइविंग लाइसेंस","ಚಾಲನಾ ಪರವಾನಗಿ"],
  "driving-licence-renewal": ["dl renewal","driving licence renewal","renew dl","renew driving licence","driving license renewal","expired dl","dl expired","licence renew","ड्राइविंग लाइसेंस नवीनीकरण","ಚಾಲನಾ ಪರವಾನಗಿ ನವೀಕರಣ","DL ನವೀಕರಣ"],
  "voter-id-new": ["voter id","voter card","epic card","voter registration","new voter","election card","वोटर आईडी","ಮತದಾರ ಗುರುತುಪತ್ರ"],
  "voter-id-correction": ["voter id correction","voter card correction","epic correction","voter id name change","form 8","वोटर आईडी सुधार","ಮತದಾರ ಕಾರ್ಡ್ ತಿದ್ದುಪಡಿ"],
  "ration-card": ["ration card","ration","bpl card","apl card","food card","ahara","राशन कार्ड","ಪಡಿತರ ಚೀಟಿ"],
  "income-certificate": ["income certificate","income proof","salary certificate","annual income","nadakacheri","आय प्रमाणपत्र","ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ"],
  "caste-certificate": ["caste certificate","sc certificate","st certificate","obc certificate","community certificate","जाति प्रमाणपत्र","ಜಾತಿ ಪ್ರಮಾಣಪತ್ರ"],
  "birth-certificate": ["birth certificate","birth proof","janma certificate","जन्म प्रमाणपत्र","ಜನನ ಪ್ರಮಾಣಪತ್ರ"],
  "death-certificate": ["death certificate","death proof","mrityu certificate","मृत्यु प्रमाणपत्र","ಮರಣ ಪ್ರಮಾಣಪತ್ರ"],
  "domicile-certificate": ["domicile certificate","residence certificate","state certificate","karnataka domicile","अधिवास प्रमाणपत्र","ನಿವಾಸ ಪ್ರಮಾಣಪತ್ರ"],
  "passport": ["passport","new passport","passport renewal","travel document","international travel","पासपोर्ट","ಪಾಸ್‌ಪೋರ್ಟ್"],
  "duplicate-driving-licence": ["duplicate dl","lost dl","duplicate driving licence","lost driving licence","stolen driving licence","डुप्लीकेट DL","ಡುಪ್ಲಿಕೇಟ್ DL"],
  "dl-correction": ["dl address change","driving licence address","dl name change","driving licence correction","DL पता बदलें","ಚಾಲನಾ ಪರವಾನಗಿ ವಿಳಾಸ"],
  "legal-heir-certificate": ["legal heir","legal heir certificate","succession certificate","heir certificate","inheritance","कानूनी उत्तराधिकारी","ಕಾನೂನು ವಾರಸುದಾರ"],
  "non-creamy-layer-certificate": ["non creamy layer","ncl certificate","obc ncl","creamy layer","नॉन क्रीमी लेयर","ನಾನ್ ಕ್ರೀಮಿ ಲೇಯರ್"],
  "khata-certificate-transfer": ["khata","khata certificate","khata transfer","bbmp khata","khata extract","खाता","ಖಾತಾ"],
  "property-tax-bbmp": ["property tax","bbmp tax","house tax","property tax payment","संपत्ति कर","ಆಸ್ತಿ ತೆರಿಗೆ"],
  "encumbrance-certificate": ["encumbrance certificate","ec certificate","property ec","kaveri ec","भार प्रमाणपत्र","ಅಡಮಾನ ಪ್ರಮಾಣಪತ್ರ"],
  "rtc-pahani": ["rtc","pahani","land record","bhoomi rtc","record of rights","survey number","आरटीसी","ಆರ್‌ಟಿಸಿ","ಪಹಾಣಿ"],
  "vehicle-rc-new": ["vehicle registration","new vehicle rc","rc registration","car registration","bike registration","वाहन पंजीकरण","ವಾಹನ ನೋಂದಣಿ"],
  "vehicle-rc-transfer": ["rc transfer","vehicle transfer","ownership transfer rc","second hand car","used vehicle","वाहन स्थानांतरण","RC ವರ್ಗಾವಣೆ"],
  "marriage-certificate": ["marriage certificate","marriage registration","vivah certificate","wedding certificate","विवाह प्रमाणपत्र","ವಿವಾಹ ಪ್ರಮಾಣಪತ್ರ"],
  "police-clearance-certificate": ["police clearance","pcc","character certificate","police certificate","पुलिस क्लियरेंस","ಪೊಲೀಸ್ ಕ್ಲಿಯರೆನ್ಸ್"],
  "disability-certificate": ["disability certificate","udid","divyang certificate","pwd certificate","handicap certificate","विकलांगता प्रमाणपत्र","ಅಂಗವೈಕಲ್ಯ ಪ್ರಮಾಣಪತ್ರ"],
  "epf-uan-services": ["epf","pf","epfo","uan","provident fund","epf withdrawal","pf transfer","pf balance","ಇಪಿಎಫ್"],
};

export function normalizeInput(input: string): string {
  return input.toLowerCase().replace(/[^\w\s\u0900-\u097F\u0C80-\u0CFF]/g, " ").replace(/\s+/g, " ").trim();
}

export function keywordMatch(normalizedInput: string, serviceSlugToId: Record<string, string>): MatchCandidate[] {
  const candidates: MatchCandidate[] = [];
  for (const [slug, keywords] of Object.entries(SERVICE_KEYWORD_MAP)) {
    const serviceId = serviceSlugToId[slug];
    if (!serviceId) continue;
    let score = 0;
    let method: MatchCandidate["method"] = "keyword";
    for (const keyword of keywords) {
      const kw = keyword.toLowerCase();
      if (normalizedInput === kw) { score += 100; method = "exact"; }
      else if (normalizedInput.includes(kw) || kw.includes(normalizedInput)) { score += 50; }
      else {
        const overlap = kw.split(" ").filter((w) => normalizedInput.split(" ").includes(w)).length;
        if (overlap > 0) score += overlap * 15;
      }
    }
    if (score > 0) candidates.push({ service_id: serviceId, service_slug: slug, name: slug.replace(/-/g, " "), score, method, confidence: score >= 80 ? "high" : score >= 30 ? "medium" : "low" });
  }
  return candidates.sort((a, b) => b.score - a.score);
}

export function assembleMatchResult(candidates: MatchCandidate[], language = "en"): MatchResult {
  if (candidates.length === 0) return { matched: false, service_id: null, service_slug: null, confidence: null, candidates: [], method: null, requires_clarification: false, clarification_question: null };
  const top = candidates[0];
  if (top.score >= 60) return { matched: true, service_id: top.service_id, service_slug: top.service_slug, confidence: "high", candidates, method: top.method, requires_clarification: false, clarification_question: null };
  const close = candidates.filter((c) => c.score >= 30 && c.score >= top.score * 0.7);
  if (close.length >= 2) {
    const q: Record<string, string> = { en: "I found a few services that might match. Could you tell me more?", hi: "कृपया अधिक जानकारी दें।", kn: "ದಯವಿಟ್ಟು ಹೆಚ್ಚಿನ ಮಾಹಿತಿ ನೀಡಿ." };
    return { matched: false, service_id: null, service_slug: null, confidence: "medium", candidates: close, method: "keyword", requires_clarification: true, clarification_question: q[language] ?? q.en };
  }
  if (top.score >= 30) return { matched: true, service_id: top.service_id, service_slug: top.service_slug, confidence: "low", candidates, method: top.method, requires_clarification: false, clarification_question: null };
  return { matched: false, service_id: null, service_slug: null, confidence: null, candidates, method: null, requires_clarification: false, clarification_question: null };
}

export function runKeywordPipeline(userInput: string, serviceSlugToId: Record<string, string>, language = "en"): MatchResult {
  return assembleMatchResult(keywordMatch(normalizeInput(userInput), serviceSlugToId), language);
}
