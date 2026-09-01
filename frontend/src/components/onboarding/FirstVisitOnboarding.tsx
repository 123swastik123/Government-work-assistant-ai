"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/components/providers";

export function FirstVisitOnboarding() {
  const { hasOnboarded, isLoading } = useApp();
  const router = useRouter();

  // A first visit begins in the dedicated personalization flow, rather than
  // showing a transient home-page modal behind it.
  useEffect(() => {
    if (!isLoading && !hasOnboarded) router.replace("/onboarding?welcome=1");
  }, [hasOnboarded, isLoading, router]);

  return null;
}
