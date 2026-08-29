// ─── Guest session management ─────────────────────────────────
// Generates and persists a secure guest session ID in localStorage.
// No PII is used as the session identifier.

import { v4 as uuidv4 } from "uuid";
import type { GuestProfile, Language } from "@/types";

const GUEST_SESSION_KEY = "gwh_guest_session";

export function getOrCreateGuestSession(): GuestProfile {
  if (typeof window === "undefined") {
    return createDefaultGuestProfile();
  }
  try {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as GuestProfile;
      if (parsed.guest_session_id) return parsed;
    }
  } catch {
    // Corrupted storage — create fresh
  }
  const fresh = createDefaultGuestProfile();
  saveGuestSession(fresh);
  return fresh;
}

export function saveGuestSession(profile: GuestProfile): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(profile));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function updateGuestSession(updates: Partial<GuestProfile>): GuestProfile {
  const current = getOrCreateGuestSession();
  const updated = { ...current, ...updates };
  saveGuestSession(updated);
  return updated;
}

export function clearGuestSession(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(GUEST_SESSION_KEY);
  } catch {
    // ignore
  }
}

function createDefaultGuestProfile(): GuestProfile {
  return {
    guest_session_id: uuidv4(),
    language: detectBrowserLanguage(),
    state: "karnataka",
    age_bracket: null,
    category: null,
    collected_answers: {},
  };
}

function detectBrowserLanguage(): Language {
  if (typeof window === "undefined") return "en";
  const lang = navigator.language?.toLowerCase() ?? "";
  if (lang.startsWith("kn")) return "kn";
  if (lang.startsWith("hi")) return "hi";
  return "en";
}
