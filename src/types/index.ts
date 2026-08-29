// ─── Core Domain Types ────────────────────────────────────────────────────────

export type Language = "en" | "hi" | "kn";
export type State = "karnataka";
export type AgeGroup = "under_18" | "18_25" | "26_35" | "36_50" | "51_60" | "60_plus";
export type ServiceTier = 1 | 2 | 3;
export type VerificationStatus = "verified" | "needs_verification" | "draft" | "inactive";
export type EligibilityStatus = "eligible" | "not_eligible" | "needs_information";
export type JourneyStatus = "started" | "in_progress" | "completed" | "abandoned";
export type UnlistedRequestStatus = "pending" | "under_review" | "accepted" | "rejected";
export type MessageRole = "user" | "assistant" | "system";
export type QuestionType = "boolean" | "select" | "text" | "number" | "date";
export type DocumentStatus = "required" | "optional" | "conditional";

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface UserProfile {
  id: string;
  auth_user_id: string | null;
  language: Language;
  state: State;
  age_bracket: AgeGroup | null;
  category: string | null;
  district: string | null;
  location_type: "urban" | "rural" | null;
  created_at: string;
  updated_at: string;
}

export interface GuestProfile {
  guest_session_id: string;
  language: Language;
  state: State;
  age_bracket: AgeGroup | null;
  category: string | null;
  collected_answers: Record<string, unknown>;
}

// ─── Service Category ─────────────────────────────────────────────────────────

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  icon: string;
  translations: Record<Language, string>;
  active: boolean;
}

// ─── Eligibility ──────────────────────────────────────────────────────────────

export type EligibilityOperator =
  | "equals" | "not_equals"
  | "greater_than" | "greater_than_or_equal"
  | "less_than" | "less_than_or_equal"
  | "in" | "not_in"
  | "exists" | "not_exists"
  | "contains" | "not_contains";

export interface EligibilityCondition {
  field: string;
  operator: EligibilityOperator;
  value: unknown;
  message?: string; // Human-readable reason if this condition fails
}

export interface EligibilityGroup {
  all?: Array<EligibilityCondition | EligibilityGroup>;
  any?: Array<EligibilityCondition | EligibilityGroup>;
  message?: string;
}

export type EligibilityRule = EligibilityCondition | EligibilityGroup;

export interface EligibilityResult {
  status: EligibilityStatus;
  reasons: string[];
  missing_fields: string[];
  passed_conditions: string[];
}

// ─── Service Questions ────────────────────────────────────────────────────────

export interface QuestionOption {
  value: string;
  label: Record<Language, string>;
}

export interface ServiceQuestion {
  id: string;
  type: QuestionType;
  label: Record<Language, string>;
  placeholder?: Record<Language, string>;
  options?: QuestionOption[];
  required: boolean;
  eligibility_relevant: boolean;
  show_when?: EligibilityCondition; // conditional visibility
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: Record<Language, string>;
  };
}

// ─── Documents ────────────────────────────────────────────────────────────────

export interface DocumentRequirement {
  id: string;
  name: Record<Language, string>;
  description?: Record<Language, string>;
  status: DocumentStatus;
  required_when?: EligibilityCondition;
  notes?: Record<Language, string>;
}

// ─── Fee ──────────────────────────────────────────────────────────────────────

export interface ServiceFee {
  amount: number | null;        // null = not verified
  currency: "INR";
  is_free: boolean;
  notes: Record<Language, string> | null;
  varies_by: string | null;     // e.g. "age", "licence_category"
  fee_table?: Array<{ condition: string; amount: number }>;
  source_url?: string;
  verified_on?: string;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

export interface ServiceStep {
  step_number: number;
  title: Record<Language, string>;
  description: Record<Language, string>;
  action_url?: string;         // must come from DB, never AI-generated
  action_label?: Record<Language, string>;
  is_online: boolean;
  is_offline: boolean;
}

// ─── Troubleshooting ─────────────────────────────────────────────────────────

export interface TroubleshootingItem {
  problem: Record<Language, string>;
  solution: Record<Language, string>;
  defer_to_official: boolean;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export interface Service {
  id: string;
  slug: string;
  name: Record<Language, string>;
  category: string;
  tier: ServiceTier;
  state: State;
  description: Record<Language, string>;
  short_description: Record<Language, string>;
  eligibility_rules: EligibilityRule | null;
  questions: ServiceQuestion[];
  required_documents: DocumentRequirement[];
  conditional_documents: DocumentRequirement[];
  official_fee: ServiceFee | null;
  steps: ServiceStep[];
  official_url: string;
  official_url_label: Record<Language, string>;
  what_happens_after: Record<Language, string> | null;
  troubleshooting: TroubleshootingItem[];
  source_notes: string | null;
  verification_status: VerificationStatus;
  last_verified_on: string | null;
  created_at: string;
  updated_at: string;
  version: number;
  active: boolean;
  keywords: string[];           // for keyword matching
}

export interface ServiceSummary {
  id: string;
  slug: string;
  name: Record<Language, string>;
  short_description: Record<Language, string>;
  category: string;
  tier: ServiceTier;
  verification_status: VerificationStatus;
  last_verified_on: string | null;
  official_url: string;
  active: boolean;
}

// ─── Service Context (sent to AI) ────────────────────────────────────────────

export interface ServiceContext {
  service_id: string;
  name: string;
  description: string;
  eligibility_result: EligibilityResult;
  applicable_documents: DocumentRequirement[];
  fee: ServiceFee | null;
  steps: ServiceStep[];
  what_happens_after: string | null;
  troubleshooting: TroubleshootingItem[];
  official_url: string;
  last_verified_on: string | null;
  verification_status: VerificationStatus;
}

// ─── Conversation ─────────────────────────────────────────────────────────────

export interface Conversation {
  id: string;
  user_id: string | null;
  guest_session_id: string | null;
  language: Language;
  state: State;
  matched_service_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface ConversationMessage {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  structured_response: AIResponse | null;
  created_at: string;
}

// ─── AI Response ──────────────────────────────────────────────────────────────

export interface AIResponse {
  reply_text: string;
  matched_service_id: string | null;
  is_general_info: boolean;
  needs_follow_up: boolean;
  follow_up_question: string | null;
  defer_to_official_portal: boolean;
  suggest_for_review: {
    suggested_name: string;
    suggested_category: string;
  } | null;
}

// ─── User Journey ─────────────────────────────────────────────────────────────

export interface UserJourney {
  id: string;
  user_id: string;
  service_id: string;
  service?: ServiceSummary;
  status: JourneyStatus;
  current_step: number;
  collected_answers: Record<string, unknown>;
  eligibility_result: EligibilityResult | null;
  created_at: string;
  updated_at: string;
}

// ─── Bookmarks & Saved ────────────────────────────────────────────────────────

export interface Bookmark {
  id: string;
  user_id: string;
  service_id: string;
  service?: ServiceSummary;
  created_at: string;
}

export interface SavedService {
  id: string;
  user_id: string;
  service_id: string;
  service?: ServiceSummary;
  created_at: string;
}

// ─── History ─────────────────────────────────────────────────────────────────

export interface HistoryEntry {
  id: string;
  user_id: string;
  service_id: string | null;
  service?: ServiceSummary;
  query: string;
  created_at: string;
}

// ─── Unlisted Request ─────────────────────────────────────────────────────────

export interface UnlistedRequest {
  id: string;
  user_id: string | null;
  guest_session_id: string | null;
  suggested_name: string;
  suggested_category: string;
  original_query: string;
  language: Language;
  state: State;
  status: UnlistedRequestStatus;
  created_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

// ─── Service Matching ─────────────────────────────────────────────────────────

export interface MatchCandidate {
  service_id: string;
  service_slug: string;
  name: string;
  score: number;
  method: "keyword" | "semantic" | "category" | "exact";
  confidence: "high" | "medium" | "low";
}

export interface MatchResult {
  matched: boolean;
  service_id: string | null;
  service_slug: string | null;
  confidence: "high" | "medium" | "low" | null;
  candidates: MatchCandidate[];
  method: string | null;
  requires_clarification: boolean;
  clarification_question: string | null;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  actor_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ─── Service Version ─────────────────────────────────────────────────────────

export interface ServiceVersion {
  id: string;
  service_id: string;
  version: number;
  snapshot: Service;
  changed_by: string | null;
  change_reason: string | null;
  created_at: string;
}

// ─── Analytics Events ─────────────────────────────────────────────────────────

export type AnalyticsEvent =
  | "personalization_started"
  | "personalization_completed"
  | "personalization_skipped"
  | "search_started"
  | "service_matched"
  | "service_viewed"
  | "eligibility_completed"
  | "document_checklist_viewed"
  | "pdf_generated"
  | "official_portal_clicked"
  | "service_saved"
  | "service_bookmarked"
  | "unmatched_request_submitted"
  | "assistant_opened"
  | "assistant_navigated";

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Admin ────────────────────────────────────────────────────────────────────

export interface AdminUser {
  id: string;
  email: string;
  role: "admin" | "super_admin";
}
