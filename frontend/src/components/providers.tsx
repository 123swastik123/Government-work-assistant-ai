"use client";
import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { getOrCreateGuestSession, saveGuestSession } from "@/lib/session/guest";
import type { User } from "@supabase/supabase-js";
import type { GuestProfile, Language } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const ONBOARDING_KEY = "gwh_onboarding_done";

const DEFAULT_GUEST_PROFILE: GuestProfile = {
  guest_session_id: "default-session",
  language: "en",
  state: "karnataka",
  age_bracket: null,
  category: null,
  location_type: null,
  collected_answers: {},
};

interface AppContextValue {
  user: User | null;
  guestProfile: GuestProfile;
  updateGuestProfile: (updates: Partial<GuestProfile>) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  isLoading: boolean;
  hasOnboarded: boolean;
  markOnboarded: () => void;
  resetOnboarding: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [guestProfile, setGuestProfile] = useState<GuestProfile>(DEFAULT_GUEST_PROFILE);
  const [isLoading, setIsLoading] = useState(true);
  const [hasOnboarded, setHasOnboarded] = useState(true); // default true for SSR, checked on client mount

  // Sync localStorage & auth on mount
  useEffect(() => {
    // Keep guest mode fast and reliable when a local developer has not yet
    // configured Supabase; never issue requests to placeholder domains.
    if (!isSupabaseConfigured()) {
      setIsLoading(false);
      return;
    }
    try {
      const session = getOrCreateGuestSession();
      setGuestProfile(session);
      const done = localStorage.getItem(ONBOARDING_KEY);
      setHasOnboarded(done === "true");
    } catch {
      setHasOnboarded(false);
    }
  }, []);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data }) => {
        setUser(data.user);
        setIsLoading(false);
      }).catch(() => {
        setIsLoading(false);
      });

      const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });
      return () => subscription.unsubscribe();
    } catch {
      setIsLoading(false);
    }
  }, []);

  const updateGuestProfile = useCallback((updates: Partial<GuestProfile>) => {
    setGuestProfile((prev) => {
      const updated = { ...prev, ...updates };
      saveGuestSession(updated);
      return updated;
    });
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    updateGuestProfile({ language: lang });
    if (user) {
      fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: lang }),
      }).catch(() => {});
    }
  }, [updateGuestProfile, user]);

  const markOnboarded = useCallback(() => {
    try { localStorage.setItem(ONBOARDING_KEY, "true"); } catch { /* ignore */ }
    document.cookie = "civicpath_onboarding=v1; path=/; max-age=31536000; samesite=lax";
    setHasOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    try { localStorage.removeItem(ONBOARDING_KEY); } catch { /* ignore */ }
    document.cookie = "civicpath_onboarding=; path=/; max-age=0; samesite=lax";
    setHasOnboarded(false);
  }, []);

  const language: Language = guestProfile.language ?? "en";

  return (
    <AppContext.Provider value={{
      user,
      guestProfile,
      updateGuestProfile,
      language,
      setLanguage,
      isLoading,
      hasOnboarded,
      markOnboarded,
      resetOnboarding,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within Providers");
  return ctx;
}
