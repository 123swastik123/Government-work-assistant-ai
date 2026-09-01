"use client";
import { useState, useRef, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Send, RotateCcw, AlertTriangle, Info, ExternalLink, Sparkles, ArrowUpRight, Car, FileText, Vote, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/providers";
import { trackEvent } from "@/lib/analytics/events";
import type { AIResponse } from "@/types";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  response?: AIResponse;
}

interface MatchedService {
  id: string; slug: string;
  name: Record<string, string>;
  verification_status: string;
  last_verified_on: string | null;
}

function ChatInterfaceInner() {
  const searchParams = useSearchParams();
  const initialQ = searchParams.get("q") ?? "";
  const requestedService = searchParams.get("service_slug") ?? undefined;
  const { guestProfile, user, language } = useApp();

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [matchedService, setMatchedService] = useState<MatchedService | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryMsg, setRetryMsg] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const sentInitial = useRef(false);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;
    setError(null);
    setRetryMsg(null);

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    trackEvent("search_started", { query_length: text.length });

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
      if (requestedService) body.service_slug = requestedService;
      if (conversationId) body.conversation_id = conversationId;
      if (!user) body.guest_session_id = guestProfile.guest_session_id;

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json() as { success: boolean; data?: { response: AIResponse; conversation_id: string; service: MatchedService | null }; error?: string };

      if (!res.ok || !data.success) {
        if (res.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
        if (res.status === 401) throw new Error("Session expired. Please refresh the page.");
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }

      const { response, conversation_id, service } = data.data!;
      if (conversation_id && !conversationId) setConversationId(conversation_id);
      if (service) {
        setMatchedService(service);
        trackEvent("service_matched", { service_id: service.id, slug: service.slug });
      }

      setMessages((prev) => [...prev, {
        id: crypto.randomUUID(), role: "assistant",
        content: response.reply_text, response,
      }]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setError(msg);
      setRetryMsg(text);
    } finally {
      setLoading(false);
    }
  }, [loading, conversationId, guestProfile, user, language, requestedService]);

  useEffect(() => {
    if (initialQ && !sentInitial.current) {
      sentInitial.current = true;
      sendMessage(initialQ);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const reset = () => {
    setMessages([]); setConversationId(null); setMatchedService(null);
    setError(null); setRetryMsg(null);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto px-3 sm:px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-3 sm:py-4 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-brand-700 rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 text-sm sm:text-base">NammaPath Guide</h1>
            <p className="text-xs text-gray-400 hidden sm:block">Karnataka government services · Ask anything</p>
          </div>
        </div>
        {messages.length > 0 && (
          <Button variant="ghost" size="sm" onClick={reset} leftIcon={<RotateCcw className="w-3.5 h-3.5" />}>
            <span className="hidden sm:inline">Start over</span>
          </Button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 sm:py-6 space-y-3 sm:space-y-4">
        {messages.length === 0 && !loading && <EmptyState onSuggestion={sendMessage} />}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div key={msg.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
              className={cn("flex", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "user" ? (
                <div className="bubble-user max-w-[85%] sm:max-w-[75%]">{msg.content}</div>
              ) : (
                <div className="space-y-2 max-w-[90%] sm:max-w-[80%]">
                  <AssistantBubble message={msg} />
                  {msg.response?.matched_service_id && matchedService && (
                    <ServiceCard service={matchedService} />
                  )}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing indicator */}
        {loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
            <div className="bubble-assistant flex items-center gap-2 text-gray-400 text-sm">
              <TypingDots />
              <span>Figuring out the path…</span>
            </div>
          </motion.div>
        )}

        {/* Error */}
        {error && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 max-w-[90%]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <div className="flex-1">
                <p>{error}</p>
                {retryMsg && (
                  <button onClick={() => sendMessage(retryMsg)} className="text-xs text-red-600 underline mt-1">
                    Retry
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 py-3 sm:py-4">
        <div className="flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); } }}
            placeholder="Ask about any Karnataka government service…"
            rows={2}
            className="flex-1 resize-none rounded-xl border border-gray-200 bg-white px-3 sm:px-4 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all"
            disabled={loading}
            aria-label="Type your question"
          />
          <Button onClick={() => sendMessage(input)} disabled={!input.trim() || loading} loading={loading}
            size="md" className="shrink-0 rounded-xl" aria-label="Send message">
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">
          We explain — never submit applications or collect credentials.
        </p>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function TypingDots() {
  return (
    <div className="flex gap-1 items-center">
      {[0, 0.15, 0.3].map((delay, i) => (
        <motion.div key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{ y: [0, -4, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay }} />
      ))}
    </div>
  );
}

function AssistantBubble({ message }: { message: Message }) {
  const { response } = message;
  return (
    <div className="space-y-1.5">
      {response?.is_general_info && (
        <div className="flex items-center gap-1.5 text-xs text-orange-600 bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5">
          <Info className="w-3.5 h-3.5 shrink-0" />
          General info — not verified against official sources
        </div>
      )}
      {response?.defer_to_official_portal && (
        <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          For this situation, please visit the official portal
        </div>
      )}
      <div className="bubble-assistant">
        <p className="text-sm leading-relaxed">{message.content}</p>
      </div>
      {response?.needs_follow_up && response.follow_up_question && (
        <div className="bubble-assistant !bg-brand-50 !border-brand-200 text-brand-800 text-sm">
          {response.follow_up_question}
        </div>
      )}
      {response?.suggest_for_review && (
        <SuggestReviewCard suggestion={response.suggest_for_review} />
      )}
    </div>
  );
}

function SuggestReviewCard({ suggestion }: { suggestion: { suggested_name: string; suggested_category: string } }) {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      await fetch("/api/unlisted", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          suggested_name: suggestion.suggested_name,
          suggested_category: suggestion.suggested_category,
          original_query: suggestion.suggested_name,
          language: "en",
        }),
      });
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
      <p className="text-xs font-semibold text-orange-800 mb-1">Service not yet in our verified list</p>
      <p className="text-xs text-orange-700 mb-2">
        &quot;{suggestion.suggested_name}&quot; — want us to review and add it?
      </p>
      {submitted ? (
        <p className="text-xs text-emerald-600 font-medium">✓ Flagged for review — thank you!</p>
      ) : (
        <button onClick={submit} disabled={loading}
          className="text-xs font-medium text-orange-700 border border-orange-300 bg-white px-3 py-1 rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50">
          {loading ? "Submitting…" : "Flag for review"}
        </button>
      )}
    </div>
  );
}

function ServiceCard({ service }: { service: MatchedService }) {
  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
      className="border border-brand-200 bg-brand-50 rounded-xl p-3.5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-brand-600 mb-0.5 uppercase tracking-wide">Matched service</p>
          <p className="font-semibold text-gray-900 text-sm truncate">{service.name?.en ?? service.slug}</p>
          {service.last_verified_on && (
            <p className="text-xs text-gray-400 mt-0.5">
              Verified {new Date(service.last_verified_on).toLocaleDateString("en-IN")}
            </p>
          )}
        </div>
        <Link href={`/services/${service.slug}`}
          className="shrink-0 flex items-center gap-1 text-xs font-medium text-brand-600 bg-white border border-brand-300 rounded-lg px-2.5 py-1.5 hover:bg-brand-100 transition-colors">
          Guide <ArrowUpRight className="w-3 h-3" />
        </Link>
      </div>
    </motion.div>
  );
}

function EmptyState({ onSuggestion }: { onSuggestion: (s: string) => void }) {
  const suggestions: Array<{ q: string; icon: LucideIcon }> = [
    { q: "I want to renew my driving licence", icon: Car }, { q: "I need an income certificate", icon: FileText },
    { q: "How do I update my Aadhaar address?", icon: FileText }, { q: "My voter ID has a spelling error", icon: Vote },
  ];
  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 text-center px-4">
      <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-brand-500/20">
        <Sparkles className="w-7 h-7 text-white" />
      </div>
      <h2 className="font-bold text-gray-800 text-lg mb-1">What do you need help with?</h2>
      <p className="text-sm text-gray-400 mb-6">Ask in English · हिन्दी · ಕನ್ನಡ</p>
      <div className="flex flex-col gap-2 w-full max-w-sm">
        {suggestions.map((s) => (
          <button key={s.q} onClick={() => onSuggestion(s.q)}
            className="flex items-center gap-2.5 text-sm text-left text-gray-700 bg-gray-50 border border-gray-200 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 rounded-xl px-4 py-3 transition-all">
            <s.icon className="h-4 w-4 shrink-0 text-brand-600" /> {s.q}
          </button>
        ))}
      </div>
    </div>
  );
}

export function ChatInterface() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-[calc(100vh-4rem)]"><TypingDots /></div>}>
      <ChatInterfaceInner />
    </Suspense>
  );
}
