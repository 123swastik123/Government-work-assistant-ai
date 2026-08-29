// Privacy-conscious analytics — no PII, no sensitive identifiers
import type { AnalyticsEvent } from "./types";

export function trackEvent(event: AnalyticsEvent, properties?: Record<string, unknown>): void {
  // In production, replace with your analytics provider
  // e.g., PostHog (privacy-friendly) or Plausible
  if (process.env.NODE_ENV === "development") {
    console.warn(`[Analytics] ${event}`, properties ?? {});
  }
  // Example integration point:
  // window.posthog?.capture(event, sanitize(properties));
}

function sanitize(props?: Record<string, unknown>): Record<string, unknown> {
  if (!props) return {};
  const FORBIDDEN = ["aadhaar", "pan", "password", "token", "otp", "credential"];
  return Object.fromEntries(
    Object.entries(props).filter(
      ([k]) => !FORBIDDEN.some((f) => k.toLowerCase().includes(f))
    )
  );
}

export { sanitize };
