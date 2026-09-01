"use client";
// ALL hooks must be called before any conditional returns — Rules of Hooks
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, RotateCcw,
  Minimize2, Sparkles, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/components/providers";
import { usePathname, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import type { AIResponse } from "@/types";

const ALLOWED_NAV: Record<string, string> = {
  "home": "/",
  "services": "/services",
  "chat": "/chat",
  "dashboard": "/dashboard",
  "history": "/history",
  "bookmarks": "/bookmarks",
  "profile": "/profile",
  "search": "/search",
  "personalize": "/onboarding",
  "onboarding": "/onboarding",
  "how it works": "/how-it-works",
  "about": "/about",
};

interface ChatMsg {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: AIResponse;
  isNav?: boolean;
}

export function FloatingAssistant() {
  // ── ALL hooks first — no early return before this block ──────
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { guestProfile, user, language, setLanguage } = useApp();
  const pathname = usePathname();
  const router = useRouter();

  // Extract service_slug if on /services/[slug]
  const currentServiceSlug = pathname?.startsWith("/services/")
    ? pathname.replace("/services/", "").split("/")[0]
    : null;

  // Track open event
  useEffect(() => {
    if (open && !minimized) {
      trackEvent("assistant_opened");
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      return () => clearTimeout(t);
    }
  }, [open, minimized]);

  // Auto-scroll
  useEffect(() => {
    if (!minimized) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, minimized]);

  const navigate = useCallback(
    (path: string, label: string): string => {
      const allowed = Object.values(ALLOWED_NAV);
      if (!allowed.includes(path) && !allowed.some((r) => path.startsWith(r + "/"))) {
        return "I can only navigate within CivicPath Karnataka.";
      }
      router.push(path);
      trackEvent("assistant_navigated", { action: path });
      return `Taking you to ${label}.`;
    },
    [router]
  );

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || loading) return;

      const userMsg: ChatMsg = { id: crypto.randomUUID(), role: "user", content: text.trim() };
      setMessages((p) => [...p, userMsg]);
      setInput("");
      setLoading(true);

      const lower = text.toLowerCase().trim();

      // Client navigation action: Go back
      if (lower === "go back" || lower.startsWith("take me back") || lower === "back") {
        router.back();
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Going back.", isNav: true }]);
        setLoading(false);
        return;
      }

      // Client navigation action: Go forward
      if (lower === "go forward" || lower === "forward") {
        if (typeof window !== "undefined") window.history.forward();
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Going forward.", isNav: true }]);
        setLoading(false);
        return;
      }

      // Language change actions
      if (lower === "change to kannada" || lower === "switch to kannada" || lower === "kannada") {
        setLanguage("kn");
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "ಭಾಷೆಯನ್ನು ಕನ್ನಡಕ್ಕೆ ಬದಲಾಯಿಸಲಾಗಿದೆ.", isNav: true }]);
        setLoading(false);
        return;
      }
      if (lower === "change to hindi" || lower === "switch to hindi" || lower === "hindi") {
        setLanguage("hi");
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "भाषा को हिन्दी में बदल दिया गया है।", isNav: true }]);
        setLoading(false);
        return;
      }
      if (lower === "change to english" || lower === "switch to english" || lower === "english") {
        setLanguage("en");
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Language switched to English.", isNav: true }]);
        setLoading(false);
        return;
      }

      // Section scroll actions on service page
      if (lower.includes("document") || lower.includes("docs")) {
        const el = typeof document !== "undefined" ? document.getElementById("documents") : null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Scrolling to required documents.", isNav: true }]);
          setLoading(false);
          return;
        }
      }
      if (lower.includes("eligib")) {
        const el = typeof document !== "undefined" ? document.getElementById("eligibility") : null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Scrolling to eligibility criteria.", isNav: true }]);
          setLoading(false);
          return;
        }
      }
      if (lower.includes("step") || lower.includes("process")) {
        const el = typeof document !== "undefined" ? document.getElementById("steps") : null;
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
          setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Scrolling to application steps.", isNav: true }]);
          setLoading(false);
          return;
        }
      }

      // Reset / clear
      if (lower === "start over" || lower === "reset" || lower === "clear") {
        setMessages([]);
        setConvId(null);
        setLoading(false);
        return;
      }

      // Named route navigation
      for (const [keyword, path] of Object.entries(ALLOWED_NAV)) {
        if (
          lower === keyword ||
          lower === `go to ${keyword}` ||
          lower === `open ${keyword}` ||
          lower === `show ${keyword}`
        ) {
          const reply = navigate(path, keyword);
          setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: reply, isNav: true }]);
          setLoading(false);
          return;
        }
      }

      // AI backend call
      try {
        const body: Record<string, unknown> = {
          message: text.trim(),
          language,
          guest_profile: {
            state: guestProfile.state,
            age_bracket: guestProfile.age_bracket,
            category: guestProfile.category,
            location_type: guestProfile.location_type ?? null,
            collected_answers: guestProfile.collected_answers,
          },
        };
        if (currentServiceSlug) body.service_slug = currentServiceSlug;
        if (convId) body.conversation_id = convId;
        if (!user) body.guest_session_id = guestProfile.guest_session_id;

        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = (await res.json()) as {
          success: boolean;
          data?: { response: AIResponse; conversation_id: string };
        };

        if (!res.ok || !data.success) throw new Error("API error");

        const { response, conversation_id } = data.data!;
        if (conversation_id && !convId) setConvId(conversation_id);

        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: response.reply_text,
            response,
          },
        ]);
      } catch {
        setMessages((p) => [
          ...p,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "I couldn't process that right now. Please try asking again.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [loading, convId, guestProfile.guest_session_id, user, language, setLanguage, currentServiceSlug, navigate, router]
  );

  // ── Safe conditional rendering ──
  const hidden = pathname === "/onboarding";

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!hidden && (!open || minimized) && (
          <motion.button
            key="fab"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 16, stiffness: 260 }}
            onClick={() => { setOpen(true); setMinimized(false); }}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-4 z-50 flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-full pl-4 pr-5 py-3 shadow-xl shadow-brand-500/30 transition-colors md:bottom-5 md:right-5"
            aria-label="Open CivicPath assistant"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Ask Assistant</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Panel */}
      <AnimatePresence>
        {!hidden && open && !minimized && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom))] right-3 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200 md:bottom-5 md:right-5"
            style={{
              width: "min(380px, calc(100vw - 2rem))",
              maxHeight: "min(560px, calc(100vh - 6rem))",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0 bg-gray-50/70 rounded-t-2xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center shadow-sm">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 leading-tight">CivicPath Guide</p>
                  <p className="text-[10px] text-gray-500 truncate max-w-[170px]">
                    {currentServiceSlug ? `Guiding: ${currentServiceSlug}` : pathname}
                  </p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={() => { setMessages([]); setConvId(null); }}
                    aria-label="Clear chat"
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setMinimized(true)}
                  aria-label="Minimize"
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-200/50 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[220px]">
              {messages.length === 0 ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Sparkles className="w-6 h-6 text-brand-500" />
                  </div>
                  <p className="text-xs font-semibold text-gray-800">
                    How can I help you today?
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1 max-w-[240px] mx-auto leading-relaxed">
                    Ask about eligibility, documents, or say &ldquo;go to documents&rdquo; / &ldquo;change to kannada&rdquo;.
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 mt-4">
                    {[
                      "What documents do I need?",
                      "How do I renew my DL?",
                      "Check my eligibility",
                    ].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendMessage(q)}
                        className="text-[11px] bg-gray-100 hover:bg-brand-50 hover:text-brand-700 text-gray-600 px-2.5 py-1.5 rounded-lg text-left transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "flex flex-col text-xs leading-relaxed max-w-[85%]",
                      m.role === "user" ? "ml-auto items-end" : "mr-auto items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-3.5 py-2.5 rounded-2xl",
                        m.role === "user"
                          ? "bg-brand-500 text-white rounded-br-sm shadow-sm"
                          : m.isNav
                          ? "bg-purple-50 text-purple-900 border border-purple-200 rounded-bl-sm font-medium"
                          : "bg-gray-100 text-gray-800 rounded-bl-sm"
                      )}
                    >
                      {m.content}
                    </div>

                    {/* Follow up question badge */}
                    {m.response?.needs_follow_up && m.response.follow_up_question && (
                      <button
                        onClick={() => sendMessage(m.response!.follow_up_question!)}
                        className="mt-2 text-[11px] bg-amber-50 hover:bg-amber-100 text-amber-800 font-semibold px-2.5 py-1.5 rounded-lg border border-amber-200 text-left transition-colors"
                      >
                        <Sparkles className="mr-1 inline h-3 w-3" /> {m.response.follow_up_question}
                      </button>
                    )}
                  </div>
                ))
              )}

              {loading && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 py-1">
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input Footer */}
            <div className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage(input);
                }}
                className="flex items-center gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask a question or type an action..."
                  className="flex-1 text-xs bg-gray-100 border-none rounded-xl px-3.5 py-2.5 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2.5 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white rounded-xl transition-all active:scale-95 shadow-sm"
                  aria-label="Send message"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
