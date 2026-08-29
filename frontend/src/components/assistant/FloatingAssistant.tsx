"use client";
// ALL hooks must be called before any conditional returns — Rules of Hooks
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageCircle, X, Send, RotateCcw,
  Minimize2, Sparkles, AlertTriangle, ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import { useApp } from "@/components/providers";
import { usePathname, useRouter } from "next/navigation";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";
import type { AIResponse } from "@/types";

const ALLOWED_NAV: Record<string, string> = {
  "home":         "/",
  "services":     "/services",
  "chat":         "/chat",
  "dashboard":    "/dashboard",
  "history":      "/history",
  "bookmarks":    "/bookmarks",
  "profile":      "/profile",
  "search":       "/search",
  "personalize":  "/onboarding",
  "onboarding":   "/onboarding",
  "how it works": "/how-it-works",
  "about":        "/about",
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
  const [open, setOpen]           = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [messages, setMessages]   = useState<ChatMsg[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const [convId, setConvId]       = useState<string | null>(null);

  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLInputElement>(null);

  const { guestProfile, user, language } = useApp();
  const pathname = usePathname();
  const router   = useRouter();

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
        return "I can only navigate within Government Work Helper.";
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

      // Pattern-based navigation — no API call needed
      if (lower === "go back" || lower.startsWith("take me back")) {
        router.back();
        setMessages((p) => [...p, { id: crypto.randomUUID(), role: "assistant", content: "Going back.", isNav: true }]);
        setLoading(false);
        return;
      }
      if (lower === "start over" || lower === "reset" || lower === "clear") {
        setMessages([]); setConvId(null); setLoading(false);
        return;
      }

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

      // AI call
      try {
        const body: Record<string, unknown> = { message: text.trim(), language };
        if (convId) body.conversation_id = convId;
        if (!user)  body.guest_session_id = guestProfile.guest_session_id;

        const res  = await fetch("/api/ai/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json() as {
          success: boolean;
          data?: { response: AIResponse; conversation_id: string };
        };

        if (!res.ok || !data.success) throw new Error("API error");

        const { response, conversation_id } = data.data!;
        if (conversation_id && !convId) setConvId(conversation_id);

        setMessages((p) => [...p, {
          id: crypto.randomUUID(), role: "assistant",
          content: response.reply_text, response,
        }]);
      } catch {
        setMessages((p) => [...p, {
          id: crypto.randomUUID(), role: "assistant",
          content: "I couldn't process that right now. Please try again.",
        }]);
      } finally {
        setLoading(false);
      }
    },
    [loading, convId, guestProfile.guest_session_id, user, language, navigate, router]
  );

  // ── Now safe to conditionally render ──────────────────────────
  // Hide on onboarding page (but hooks are already called above)
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
            className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white rounded-full pl-4 pr-5 py-3 shadow-xl shadow-brand-500/30 transition-colors"
            aria-label="Open Government Work Helper assistant"
          >
            <MessageCircle className="w-5 h-5" />
            <span className="text-sm font-semibold">Ask me anything</span>
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
            className="fixed bottom-5 right-5 z-50 flex flex-col bg-white rounded-2xl shadow-2xl border border-gray-200"
            style={{
              width:     "min(360px, calc(100vw - 2rem))",
              maxHeight: "min(530px, calc(100vh - 6rem))",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-600 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">GWH Assistant</p>
                  <p className="text-[10px] text-gray-400 truncate max-w-[140px]">{pathname}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                {messages.length > 0 && (
                  <button
                    onClick={() => { setMessages([]); setConvId(null); }}
                    aria-label="Clear chat"
                    className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  onClick={() => setMinimized(true)}
                  aria-label="Minimize"
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Minimize2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              {messages.length === 0 && <WelcomeMsg onSuggestion={sendMessage} />}
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}>
                  {msg.role === "user" ? (
                    <div className="bg-brand-500 text-white text-sm rounded-2xl rounded-tr-sm px-3 py-2 max-w-[80%] leading-relaxed break-words">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="space-y-1.5 max-w-[88%]">
                      {msg.response?.is_general_info && (
                        <div className="text-[10px] text-orange-600 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 shrink-0" /> General info — not verified
                        </div>
                      )}
                      <div className={cn(
                        "text-sm rounded-2xl rounded-tl-sm px-3 py-2 leading-relaxed break-words",
                        msg.isNav
                          ? "bg-brand-50 border border-brand-200 text-brand-800"
                          : "bg-gray-50 border border-gray-200 text-gray-800"
                      )}>
                        {msg.content}
                      </div>
                      {msg.response?.matched_service_id && (
                        <Link
                          href={`/services/${msg.response.matched_service_id}`}
                          className="flex items-center gap-1.5 text-xs text-brand-600 bg-brand-50 border border-brand-200 rounded-lg px-2.5 py-1.5 hover:bg-brand-100 transition-colors w-fit"
                        >
                          View guide <ArrowUpRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-200 rounded-2xl rounded-tl-sm px-3 py-2.5 flex items-center gap-1.5">
                    {[0, 0.15, 0.3].map((d, i) => (
                      <motion.div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-gray-100 shrink-0">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") sendMessage(input); }}
                  placeholder="Ask anything…"
                  disabled={loading}
                  aria-label="Ask the assistant"
                  className="flex-1 text-sm border border-gray-200 rounded-xl px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
                />
                <button
                  onClick={() => sendMessage(input)}
                  disabled={!input.trim() || loading}
                  aria-label="Send"
                  className="shrink-0 w-9 h-9 bg-brand-500 hover:bg-brand-600 disabled:opacity-40 text-white rounded-xl flex items-center justify-center transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-1.5">
                No Aadhaar · No PAN · No passwords
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function WelcomeMsg({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const SUGGESTIONS = ["Renew driving licence", "Income certificate", "Go to dashboard", "Start over"];
  return (
    <div className="space-y-2.5">
      <div className="bg-brand-50 border border-brand-200 rounded-2xl rounded-tl-sm p-3 text-sm text-brand-900 leading-relaxed">
        Hi! I can help you navigate Karnataka government services, answer questions, or take you anywhere in the app.
      </div>
      <div className="flex flex-wrap gap-1.5">
        {SUGGESTIONS.map((s) => (
          <button key={s} onClick={() => onSuggestion(s)}
            className="text-xs text-gray-600 bg-gray-100 hover:bg-brand-50 hover:text-brand-600 border border-gray-200 hover:border-brand-300 rounded-full px-2.5 py-1 transition-colors">
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}
