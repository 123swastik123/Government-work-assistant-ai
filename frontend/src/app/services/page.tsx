"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, ChevronDown } from "lucide-react";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { SkeletonCard } from "@/components/ui/Spinner";
import { useApp } from "@/components/providers";
import { t } from "@/lib/utils";

interface ServiceItem {
  id: string; slug: string;
  name: Record<string, string>;
  short_description: Record<string, string>;
  category: string; tier: number;
  verification_status: string;
  last_verified_on: string | null;
}

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "identity-documents",  label: "Identity" },
  { value: "driving-transport",   label: "Driving" },
  { value: "certificates",        label: "Certificates" },
  { value: "voting",              label: "Voting" },
  { value: "property-land",       label: "Property" },
  { value: "tax-finance",         label: "Tax & Finance" },
  { value: "employment-benefits", label: "Employment" },
  { value: "family-marriage",     label: "Family" },
  { value: "police-verification", label: "Police" },
  { value: "health-disability",   label: "Health" },
  { value: "ration-food",         label: "Ration" },
];

const TIER_LABELS: Record<number, string> = {
  1: "Tier 1 — Highest frequency",
  2: "Tier 2 — Certificates & Documents",
  3: "Tier 3 — Property, Vehicles & More",
};

export default function ServicesPage() {
  const { language } = useApp();
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams({ limit: "50" });
    if (activeCategory) params.set("category", activeCategory);

    fetch(`/api/services?${params}`)
      .then((r) => r.json())
      .then((data: { success: boolean; data?: ServiceItem[]; error?: string }) => {
        if (data.success && data.data) setServices(data.data);
        else setError("Failed to load services.");
      })
      .catch(() => setError("We couldn't load services right now. Please try again."))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  const filtered = search.trim()
    ? services.filter((s) =>
        (s.name?.en ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (s.short_description?.en ?? "").toLowerCase().includes(search.toLowerCase())
      )
    : services;

  const byTier: Record<number, ServiceItem[]> = { 1: [], 2: [], 3: [] };
  filtered.forEach((s) => {
    const tier = s.tier as 1 | 2 | 3;
    byTier[tier] = byTier[tier] ?? [];
    byTier[tier].push(s);
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">All Services</h1>
        <p className="text-gray-500 mt-1 text-sm sm:text-base">
          Karnataka government services — guided by Government Work Helper
        </p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services…"
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
            aria-label="Search services"
          />
        </div>
        <div className="relative sm:w-44">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white appearance-none cursor-pointer"
            aria-label="Filter by category"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 scrollbar-none">
        {CATEGORIES.map((c) => (
          <button key={c.value} onClick={() => setActiveCategory(c.value)}
            className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all
              ${activeCategory === c.value
                ? "bg-brand-500 border-brand-500 text-white"
                : "bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
              }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700 mb-6">
          {error}
        </div>
      )}

      {/* Loading skeletons */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">🔍</p>
          <h3 className="font-semibold text-gray-700">No services found</h3>
          <p className="text-sm text-gray-400 mt-1">
            Try a different search or{" "}
            <button onClick={() => { setSearch(""); setActiveCategory(""); }} className="text-brand-500 underline">
              clear filters
            </button>
          </p>
        </div>
      )}

      {/* Services by tier */}
      {!loading && !error && filtered.length > 0 && (
        <div className="space-y-10">
          {([1, 2, 3] as const).map((tier) => {
            const list = byTier[tier] ?? [];
            if (list.length === 0) return null;
            return (
              <section key={tier}>
                <div className="flex items-center gap-3 mb-4">
                  <h2 className="text-base font-semibold text-gray-700">{TIER_LABELS[tier]}</h2>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{list.length}</span>
                </div>
                <AnimatePresence initial={false}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {list.map((svc, i) => (
                      <motion.div key={svc.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04, duration: 0.3 }}
                      >
                        <ServiceCard svc={svc} language={language} />
                      </motion.div>
                    ))}
                  </div>
                </AnimatePresence>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ServiceCard({ svc, language }: { svc: ServiceItem; language: string }) {
  return (
    <Link href={`/services/${svc.slug}`}>
      <Card hover padding="md" className="h-full flex flex-col justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1">
            {t(svc.name, language as "en" | "hi" | "kn")}
          </h3>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
            {t(svc.short_description, language as "en" | "hi" | "kn")}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="default" className="capitalize text-xs">
            {svc.category?.replace(/-/g, " ")}
          </Badge>
          <VerificationBadge
            status={svc.verification_status as "verified" | "needs_verification" | "draft" | "inactive"}
          />
        </div>
      </Card>
    </Link>
  );
}
