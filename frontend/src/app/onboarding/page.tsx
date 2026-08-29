import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Personalize your experience" };

export default function OnboardingPage() {
  return <OnboardingFlow />;
}
