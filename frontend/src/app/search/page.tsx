"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Sparkles, SearchX } from "lucide-react";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { SkeletonCard } from "@/components/ui/Spinner";
import { useApp } from "@/components/providers";
import { t } from "@/lib/utils";

interface Result {
  id: string; slug: string;
  name: Record<string, string>;
  short_description: Record<string, string>;
  category: string; tier: number;
  verification_status: string;
}

const SUGGESTIONS = [
  "Driving Licence Renewal",
  "Aadhaar Address Change",
  "Income Certificate",
  "Voter ID Registration",
  "PAN Card Application",
  "Birth Certificate",
  "Passport Renewal",
  "Khata Transfer",
];

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { language } = useApp();
  const initialQ = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQ);
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(!!initialQ);

  const doSearch = useCallback(async (q: string) => {
    if (!q.trim()) { setResults([]); setHasSearched(false); return; }
    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q.trim())}&language=${language}&limit=20`);
      const data = await res.json();
      if (data.success) setResults(data.data);
      else setError("Search failed. Please try again.");
    } catch {
      setError("We couldn't complete the search. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [language]);

  // Initial search from URL param
  useEffect(() => {
    if (initialQ) doSearch(initialQ);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search as user types
  useEffect(() => {
    if (!query.trim()) { setResults([]); setHasSearched(false); return; }
    const timer = setTimeout(() => {
      doSearch(query);
      router.replace(`/search?q=${encodeURIComponent(query.trim())}`, { scroll: false });
    }, 400);
    return () => clearTimeout(timer);
  }, [query, doSearch, router]);

  const handleEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") doSearch(query);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1">Search services</h1>
        <p className="text-sm text-gray-500">Ask in English · हिन्दी · ಕನ್ನಡ</p>
      </div>

      {/* Search input */}
      <div className="relative mb-6 sm:mb-8">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleEnter}
          placeholder="e.g. renew driving licence, income certificate…"
          autoFocus
          className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-2xl text-base focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white shadow-sm"
          aria-label="Search for government services"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setHasSearched(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
          >
            Clear
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <>
          {results.length === 0 ? (
            <NoResults query={query} onAI={() => router.push(`/chat?q=${encodeURIComponent(query)}`)} />
          ) : (
            <div>
              <p className="text-xs text-gray-400 mb-4">
                {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{query}&rdquo;
              </p>
              <AnimatePresence initial={false}>
                <div className="space-y-2.5">
                  {results.map((svc, i) => (
                    <motion.div key={svc.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04, duration: 0.25 }}
                    >
                      <Link href={`/services/${svc.slug}`}>
                        <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-100 rounded-2xl hover:border-brand-200 hover:shadow-card-hover transition-all group">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 text-sm group-hover:text-brand-700 transition-colors">
                              {t(svc.name, language)}
                            </h3>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">
                              {t(svc.short_description, language)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                              <Badge variant="default" className="text-xs capitalize">
                                {svc.category?.replace(/-/g, " ")}
                              </Badge>
                              <VerificationBadge
                                status={svc.verification_status as "verified" | "needs_verification" | "draft" | "inactive"}
                              />
                            </div>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </AnimatePresence>

              {/* Ask AI option */}
              <div className="mt-6 p-4 bg-brand-50 border border-brand-200 rounded-2xl">
                <p className="text-sm text-brand-800 font-medium mb-2">Not what you were looking for?</p>
                <button
                  onClick={() => router.push(`/chat?q=${encodeURIComponent(query)}`)}
                  className="flex items-center gap-2 text-sm text-brand-600 hover:text-brand-700 font-medium"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask the AI assistant instead →
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Suggestions when empty */}
      {!hasSearched && !loading && (
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-3">Popular searches</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((s) => (
              <button key={s} onClick={() => setQuery(s)}
                className="text-sm text-gray-600 bg-white border border-gray-200 hover:border-brand-300 hover:text-brand-600 hover:bg-brand-50 px-3.5 py-1.5 rounded-full transition-all">
                {s}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function NoResults({ query, onAI }: { query: string; onAI: () => void }) {
  return (
    <div className="text-center py-12">
      <SearchX className="mx-auto mb-3 h-9 w-9 text-brand-500" />
      <h3 className="font-semibold text-gray-700 mb-1">No results for &ldquo;{query}&rdquo;</h3>
      <p className="text-sm text-gray-400 mb-5">
        Try different words, or let the AI assistant help you.
      </p>
      <button
        onClick={onAI}
        className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
      >
        <Sparkles className="w-4 h-4" />
        Ask the assistant
      </button>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="max-w-3xl mx-auto px-4 py-10 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  );
}
