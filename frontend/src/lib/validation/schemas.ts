import { z } from "zod";

// ─── Profile ──────────────────────────────────────────────────
export const LanguageSchema = z.enum(["en", "hi", "kn"]);
export const AgeGroupSchema = z.enum(["under_18", "18_25", "26_35", "36_50", "51_60", "60_plus"]);
export const StateSchema = z.literal("karnataka");

export const ProfileUpdateSchema = z.object({
  language: LanguageSchema.optional(),
  age_bracket: AgeGroupSchema.optional(),
  category: z.string().max(100).optional(),
  district: z.string().max(100).optional(),
  location_type: z.enum(["urban", "rural"]).optional(),
});

// ─── Guest session ────────────────────────────────────────────
export const GuestSessionSchema = z.object({
  guest_session_id: z.string().uuid(),
  language: LanguageSchema,
  state: StateSchema,
  age_bracket: AgeGroupSchema.nullable(),
  category: z.string().max(100).nullable(),
  collected_answers: z.record(z.unknown()),
});

// ─── AI chat request ──────────────────────────────────────────
export const ChatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  conversation_id: z.string().uuid().optional(),
  guest_session_id: z.string().uuid().optional(),
  service_slug: z.string().max(100).optional(),
  language: LanguageSchema.optional(),
  // Non-sensitive context collected during onboarding. Never includes identity
  // numbers, contact details, passwords, OTPs, or an address.
  guest_profile: z.object({
    state: StateSchema.optional(),
    age_bracket: AgeGroupSchema.nullable().optional(),
    category: z.string().max(100).nullable().optional(),
    location_type: z.enum(["urban", "rural"]).nullable().optional(),
    collected_answers: z.record(z.unknown()).optional(),
  }).optional(),
});

// ─── Search ───────────────────────────────────────────────────
export const SearchRequestSchema = z.object({
  q: z.string().min(1).max(500),
  language: LanguageSchema.optional().default("en"),
  category: z.string().max(100).optional(),
  limit: z.coerce.number().min(1).max(20).default(10),
});

// ─── Unlisted request ─────────────────────────────────────────
export const UnlistedRequestSchema = z.object({
  suggested_name: z.string().min(2).max(200),
  suggested_category: z.string().min(2).max(100),
  original_query: z.string().min(2).max(1000),
  language: LanguageSchema.default("en"),
  guest_session_id: z.string().uuid().optional(),
});

// ─── AI response (for validation) ────────────────────────────
export const AIResponseSchema = z.object({
  reply_text: z.string().min(1),
  matched_service_id: z.string().nullable(),
  is_general_info: z.boolean(),
  needs_follow_up: z.boolean(),
  follow_up_question: z.string().nullable(),
  defer_to_official_portal: z.boolean(),
  suggest_for_review: z.object({
    suggested_name: z.string().min(1),
    suggested_category: z.string().min(1),
  }).nullable(),
});

// ─── Journey answer ───────────────────────────────────────────
export const JourneyAnswerSchema = z.object({
  service_id: z.string().uuid(),
  question_id: z.string().max(100),
  answer: z.unknown(),
});

// ─── PDF generation ───────────────────────────────────────────
export const PDFRequestSchema = z.object({
  service_slug: z.string().max(100),
  answers: z.record(z.unknown()),
  language: LanguageSchema.optional().default("en"),
});

// ─── Admin service update ─────────────────────────────────────
export const AdminServiceUpdateSchema = z.object({
  name: z.record(z.string()).optional(),
  description: z.record(z.string()).optional(),
  short_description: z.record(z.string()).optional(),
  official_url: z.string().url().optional(),
  verification_status: z.enum(["verified", "needs_verification", "draft", "inactive"]).optional(),
  last_verified_on: z.string().date().optional(),
  source_notes: z.string().max(2000).optional(),
  active: z.boolean().optional(),
  change_reason: z.string().max(500).optional(),
});

// ─── File upload ──────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = [
  "image/jpeg", "image/png", "image/webp",
  "application/pdf",
  "image/gif",
];
export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export function validateUploadedFile(file: { type: string; size: number }) {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: "File type not allowed. Accepted: JPEG, PNG, WEBP, PDF, GIF." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { valid: false, error: "File size exceeds 5 MB limit." };
  }
  return { valid: true, error: null };
}
