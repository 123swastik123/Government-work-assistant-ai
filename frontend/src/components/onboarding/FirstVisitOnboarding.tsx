"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers";

export function FirstVisitOnboarding() {
  const { hasOnboarded, markOnboarded, isLoading } = useApp();
  const [visible, setVisible] = useState(false);
  const router = useRouter();

  // Show after a brief delay so the page paints first
  useEffect(() => {
    if (!isLoading && !hasOnboarded) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isLoading, hasOnboarded]);

  const dismiss = () => {
    markOnboarded();
    setVisible(false);
  };

  const goPersonalize = () => {
    markOnboarded();
    setVisible(false);
    router.push("/onboarding?redirectTo=/");
  };

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={dismiss}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="fixed inset-x-4 bottom-0 sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 z-50 w-full sm:max-w-md"
          >
            <div className="bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
              {/* Top gradient strip */}
              <div className="h-1.5 bg-gradient-to-r from-brand-400 via-purple-400 to-brand-500" />

              <div className="p-6 sm:p-8">
                {/* Close */}
                <button
                  onClick={dismiss}
                  className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Dismiss"
                >
                  <X className="w-4 h-4" />
                </button>

                {/* Icon */}
                <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/30 mb-5">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  Welcome to Government Work Helper
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mb-6">
                  Get personalized guidance for Karnataka government services in your language — in under 2 minutes.
                </p>

                {/* Benefits */}
                <ul className="space-y-2.5 mb-7">
                  {[
                    { icon: "🌐", text: "Choose your preferred language" },
                    { icon: "🎯", text: "Get relevant services for your needs" },
                    { icon: "⚡", text: "Skip questions you've already answered" },
                  ].map((item) => (
                    <li key={item.text} className="flex items-center gap-3 text-sm text-gray-700">
                      <span className="text-base">{item.icon}</span>
                      {item.text}
                    </li>
                  ))}
                </ul>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={goPersonalize}
                    className="w-full flex items-center justify-center gap-2 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-sm shadow-brand-500/20"
                  >
                    Personalize my experience
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={dismiss}
                    className="w-full text-sm text-gray-400 hover:text-gray-600 py-2 transition-colors"
                  >
                    Skip for now — go straight to search
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
