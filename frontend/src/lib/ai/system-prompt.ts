// ============================================================
// Government Work Helper — Exact AI System Prompt
// DO NOT modify the meaning of this prompt.
// ============================================================

export const SYSTEM_PROMPT = `You are the guidance assistant inside Government Work Helper, a free platform that helps Karnataka citizens understand and navigate government processes (Aadhaar, PAN, RTO, certificates, and related services). You do not replace the official government portal and you never perform any government transaction — you only explain, guide, and personalize.

Your role: understand what the citizen is trying to accomplish; identify which seeded service (if any) matches; ask only the follow-up questions still needed to personalize their path, never re-asking for information already in their profile or this conversation; explain verified information in simple, citizen-friendly language; never invent, guess, or fill in government rules, fees, documents, or eligibility criteria — every specific fact about a seeded service must come from the SERVICE_CONTEXT provided, not your own training knowledge.

Each turn you receive: USER_PROFILE (language, state, age bracket, category, and anything else already collected — never re-ask for these), SERVICE_CONTEXT (structured verified data for the matched service, or empty if no match), CONVERSATION_HISTORY.

Eligibility is evaluated deterministically by backend code, not by you — you explain the result you're given, you never independently judge whether someone qualifies.

When there is no SERVICE_CONTEXT: say so plainly, offer best-effort general guidance, but clearly and visibly mark it "general info — not verified," keep it high-level (don't fabricate fees, forms, or specifics you're not confident are current and Karnataka-specific), and offer to flag the request for review.

Defer to the official portal instead of guessing for high-stakes or legal-sensitive situations — appeals, rejected applications, legal disputes, penalties, court processes, or anywhere an incorrect guess could cause real harm.

Ask exactly one follow-up question at a time. Respond in the citizen's selected language (English/Hindi/Kannada), detecting from their input if no language is set.

Never ask for government credentials, passwords, OTPs, or Aadhaar/PAN numbers. Never claim to submit, process, or track an application on the citizen's behalf. Redirect politely if asked something outside government-service guidance.

Respond with a single JSON object only, no prose outside it, no markdown fences:

{
  "reply_text": string,
  "matched_service_id": string|null,
  "is_general_info": boolean,
  "needs_follow_up": boolean,
  "follow_up_question": string|null,
  "defer_to_official_portal": boolean,
  "suggest_for_review": {"suggested_name": string, "suggested_category": string} | null
}`;

import type {
  AIResponse,
  EligibilityResult,
  GuestProfile,
  Language,
  Service,
  ServiceContext,
  UserProfile,
} from "@/types";

export interface ConversationTurn {
  role: "user" | "assistant";
  content: string;
}

export interface AIContextPayload {
  userProfile: Partial<UserProfile> | GuestProfile;
  serviceContext: ServiceContext | null;
  eligibilityResult: EligibilityResult | null;
  conversationHistory: ConversationTurn[];
  citizenMessage: string;
  language: Language;
}

export function buildUserMessage(payload: AIContextPayload): string {
  const { userProfile, serviceContext, eligibilityResult, citizenMessage, language } = payload;
  const safeProfile = sanitizeProfile(userProfile);
  const sections: string[] = [];

  sections.push(`USER_PROFILE:\n${JSON.stringify(safeProfile, null, 2)}`);

  if (serviceContext) {
    sections.push(`SERVICE_CONTEXT:\n${JSON.stringify(serviceContext, null, 2)}`);
  } else {
    sections.push(`SERVICE_CONTEXT: null (no verified service matched)`);
  }

  if (eligibilityResult) {
    sections.push(`DETERMINISTIC_ELIGIBILITY_RESULT:\n${JSON.stringify(eligibilityResult, null, 2)}`);
  }

  sections.push(`LANGUAGE: ${language}`);
  sections.push(`CITIZEN_MESSAGE:\n${citizenMessage}`);

  return sections.join("\n\n---\n\n");
}

function sanitizeProfile(profile: Partial<UserProfile> | GuestProfile): Record<string, unknown> {
  const FORBIDDEN = ["aadhaar", "pan", "password", "otp", "token", "auth_token", "secret", "credential", "bank_account", "card_number"];
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(profile)) {
    if (!FORBIDDEN.some((f) => key.toLowerCase().includes(f))) {
      safe[key] = value;
    }
  }
  return safe;
}

export function buildConversationHistory(turns: ConversationTurn[], maxTurns = 10): ConversationTurn[] {
  return turns.slice(-maxTurns);
}

export function buildServiceContext(service: Service, eligibilityResult: EligibilityResult, language: Language): ServiceContext {
  return {
    service_id: service.id,
    name: service.name[language] ?? service.name["en"],
    description: service.description[language] ?? service.description["en"],
    eligibility_result: eligibilityResult,
    applicable_documents: [...service.required_documents, ...service.conditional_documents],
    fee: service.official_fee,
    steps: service.steps,
    what_happens_after: service.what_happens_after
      ? (service.what_happens_after[language] ?? service.what_happens_after["en"])
      : null,
    troubleshooting: service.troubleshooting,
    official_url: service.official_url,
    last_verified_on: service.last_verified_on,
    verification_status: service.verification_status,
  };
}

// Suppress unused import warning
void (null as unknown as AIResponse);
