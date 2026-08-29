"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { BookmarkIcon, History, ArrowRight, Play, User } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import { useApp } from "@/components/providers";
import { t } from "@/lib/utils";

interface Props {
  user: { email: string; id: string };
  journeys: Array<{ id: string; current_step: number; status: string; service?: { id: string; slug: string; name: Record<string, string>; category: string; tier: number; verification_status: string } }>;
  bookmarks: Array<{ id: string; created_at: string; service?: { id: string; slug: string; name: Record<string, string>; category: string; tier: number } }>;
  history: Array<{ id: string; query: string; created_at: string; service?: { id: string; slug: string; name: Record<string, string> } | null }>;
}

export function DashboardClient({ user, journeys, bookmarks, history }: Props) {
  const { language } = useApp();

  const tabs = [
    {
      id: "journeys",
      label: "Active journeys",
      icon: <Play className="w-4 h-4" />,
      content: (
        <div className="space-y-3">
          {journeys.length === 0 ? (
            <EmptyState message="No active journeys. Start a search to begin." cta={{ href: "/chat", label: "Start a service journey" }} />
          ) : (
            journeys.map((j) => (
              <JourneyCard key={j.id} journey={j} language={language} />
            ))
          )}
        </div>
      ),
    },
    {
      id: "bookmarks",
      label: "Bookmarks",
      icon: <BookmarkIcon className="w-4 h-4" />,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {bookmarks.length === 0 ? (
            <EmptyState message="No bookmarks yet. Bookmark a service to save it here." />
          ) : (
            bookmarks.map((b) => (
              b.service && (
                <ServiceMiniCard key={b.id} service={b.service} language={language} />
              )
            ))
          )}
        </div>
      ),
    },
    {
      id: "history",
      label: "History",
      icon: <History className="w-4 h-4" />,
      content: (
        <div className="space-y-2">
          {history.length === 0 ? (
            <EmptyState message="No history yet. Your guidance sessions will appear here." />
          ) : (
            history.map((h) => (
              <div key={h.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div>
                  <p className="text-sm text-gray-700 font-medium">{h.query}</p>
                  {h.service && <p className="text-xs text-gray-400 mt-0.5">{t(h.service.name, language)}</p>}
                  <p className="text-xs text-gray-400">{new Date(h.created_at).toLocaleDateString("en-IN")}</p>
                </div>
                {h.service && (
                  <Link href={`/services/${h.service.slug}`}>
                    <ArrowRight className="w-4 h-4 text-gray-400 hover:text-brand-500" />
                  </Link>
                )}
              </div>
            ))
          )}
        </div>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: <User className="w-4 h-4" />,
      content: <ProfileSection email={user.email} />,
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Your dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">{user.email}</p>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Active journeys", value: journeys.length },
            { label: "Bookmarks", value: bookmarks.length },
            { label: "Sessions", value: history.length },
          ].map((stat) => (
            <Card key={stat.label} padding="md" className="text-center">
              <p className="text-2xl font-bold text-brand-600">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </Card>
          ))}
        </div>

        <Tabs tabs={tabs} variant="underline" />
      </motion.div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function JourneyCard({ journey, language }: { journey: Props["journeys"][0]; language: string }) {
  if (!journey.service) return null;
  const total = 5; // Approximate steps
  const pct = Math.round((journey.current_step / total) * 100);
  return (
    <Link href={`/services/${journey.service.slug}`}>
      <Card hover padding="md" className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium text-gray-900 truncate">{t(journey.service.name, language as "en" | "hi" | "kn")}</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-brand-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
            </div>
            <span className="text-xs text-gray-400 shrink-0">Step {journey.current_step} of {total}</span>
          </div>
        </div>
        <Button size="sm" variant="outline" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>Continue</Button>
      </Card>
    </Link>
  );
}

function ServiceMiniCard({ service, language }: { service: { id: string; slug: string; name: Record<string, string>; category: string; tier: number }; language: string }) {
  return (
    <Link href={`/services/${service.slug}`}>
      <Card hover padding="md">
        <p className="font-medium text-gray-900 text-sm">{t(service.name, language as "en" | "hi" | "kn")}</p>
        <div className="flex items-center gap-2 mt-2">
          <Badge variant="default" className="text-xs">{service.category.replace(/-/g, " ")}</Badge>
          <Badge variant="default" className="text-xs">Tier {service.tier}</Badge>
        </div>
      </Card>
    </Link>
  );
}

function EmptyState({ message, cta }: { message: string; cta?: { href: string; label: string } }) {
  return (
    <div className="text-center py-10 text-gray-400">
      <p className="text-sm">{message}</p>
      {cta && (
        <Link href={cta.href}>
          <Button variant="outline" size="sm" className="mt-4">{cta.label}</Button>
        </Link>
      )}
    </div>
  );
}

function ProfileSection({ email }: { email: string }) {
  const { language, setLanguage, guestProfile } = useApp();
  return (
    <Card padding="md" className="max-w-md">
      <h3 className="font-semibold text-gray-900 mb-4">Your preferences</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Email</span><span className="text-gray-900">{email}</span></div>
        <div className="flex justify-between"><span className="text-gray-500">State</span><span className="text-gray-900">Karnataka</span></div>
        <div className="flex justify-between items-center">
          <span className="text-gray-500">Language</span>
          <select value={language} onChange={(e) => setLanguage(e.target.value as "en" | "hi" | "kn")} className="text-sm border border-gray-200 rounded-lg px-2 py-1">
            <option value="en">English</option>
            <option value="hi">हिन्दी</option>
            <option value="kn">ಕನ್ನಡ</option>
          </select>
        </div>
        {guestProfile.age_bracket && <div className="flex justify-between"><span className="text-gray-500">Age group</span><span className="text-gray-900">{guestProfile.age_bracket.replace(/_/g, " ")}</span></div>}
      </div>
    </Card>
  );
}
