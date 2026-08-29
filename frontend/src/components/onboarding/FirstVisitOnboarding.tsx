"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useApp } from "@/components/providers";
import { OnboardingFlow } from "./OnboardingFlow";

export function FirstVisitOnboarding() {
  const { hasOnboarded, markOnboarded, isLoading } = useApp();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Open automatically on first visit without needing to click any button
  useEffect(() => {
    if (mounted && !isLoading && !hasOnboarded) {
      const timer = setTimeout(() => setOpen(true), 400);
      return () => clearTimeout(timer);
    }
  }, [mounted, isLoading, hasOnboarded]);

  const handleComplete = () => {
    markOnboarded();
    setOpen(false);
  };

  if (!mounted || hasOnboarded || !open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 16 }}
          transition={{ type: "spring", damping: 24, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#0d1326] border border-white/15 rounded-3xl shadow-2xl overflow-hidden my-auto"
        >
          {/* Top gradient highlight */}
          <div className="h-1 bg-gradient-to-r from-brand-500 via-purple-500 to-brand-400" />

          {/* Close button */}
          <button
            onClick={handleComplete}
            className="absolute top-4 right-4 z-20 p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Embedded Adaptive Onboarding Flow */}
          <div className="pt-2 pb-1">
            <OnboardingFlow isModal onComplete={handleComplete} />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
