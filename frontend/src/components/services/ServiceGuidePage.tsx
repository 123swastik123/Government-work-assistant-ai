"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, XCircle, FileText, ExternalLink,
  Download, ChevronDown, ChevronUp, ShieldCheck, Info,
  AlertTriangle, User, MapPin, Clock, Bookmark, BookmarkCheck
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/Button";
import { Badge, VerificationBadge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { useApp } from "@/components/providers";
import { t, formatCurrency, formatDate } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics/events";
import { evaluateEligibility, getApplicableDocuments } from "@/lib/ai/eligibility-engine";
import type { Service, EligibilityResult, DocumentRequirement, AgeGroup } from "@/types";

const AGE_LABELS: Record<AgeGroup, string> = {
  under_18: "Under 18", "18_25": "18–25", "26_35": "26–35",
  "36_50": "36–50", "51_60": "51–60", "60_plus": "60+",
};

interface Props { service: Service }

export function ServiceGuidePage({ service }: Props) {
  const { language, guestProfile, updateGuestProfile, user } = useApp();
  const [answers, setAnswers] = useState<Record<string, unknown>>(guestProfile.collected_answers ?? {});
  const [pdfLoading, setPdfLoading] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  // Sync bookmark state on load
  useEffect(() => {
    if (user) {
      fetch("/api/bookmarks")
        .then((r) => r.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            const hasBookmark = data.data.some((b: { service?: { id: string } }) => b.service?.id === service.id);
            setIsBookmarked(hasBookmark);
          }
        })
        .catch(() => {});
    } else {
      try {
        const stored = localStorage.getItem("gwh_guest_bookmarks");
        if (stored) {
          const list = JSON.parse(stored) as string[];
          setIsBookmarked(list.includes(service.slug));
        }
      } catch {}
    }
  }, [user, service.id, service.slug]);

  const toggleBookmark = async () => {
    setBookmarkLoading(true);
    const nextState = !isBookmarked;
    setIsBookmarked(nextState);

    if (user) {
      try {
        if (nextState) {
          await fetch("/api/bookmarks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ service_id: service.id }),
          });
          toast.success("Saved to your bookmarks");
        } else {
          await fetch(`/api/bookmarks?service_id=${service.id}`, { method: "DELETE" });
          toast.success("Removed from bookmarks");
        }
      } catch {
        toast.error("Failed to update bookmark");
      } finally {
        setBookmarkLoading(false);
      }
    } else {
      // Guest bookmark in localStorage
      try {
        const stored = localStorage.getItem("gwh_guest_bookmarks");
        let list: string[] = stored ? JSON.parse(stored) : [];
        if (nextState) {
          if (!list.includes(service.slug)) list.push(service.slug);
          toast.success("Saved to bookmarks (sign in to sync)");
        } else {
          list = list.filter((s) => s !== service.slug);
          toast.success("Removed from bookmarks");
        }
        localStorage.setItem("gwh_guest_bookmarks", JSON.stringify(list));
      } catch {}
      setBookmarkLoading(false);
    }
  };

  const handleAnswerChange = (qId: string, val: unknown) => {
    const updated = { ...answers, [qId]: val };
    setAnswers(updated);
    updateGuestProfile({
      collected_answers: { ...(guestProfile.collected_answers ?? {}), [qId]: val },
    });
  };

  const mergedAnswers = { ...guestProfile, ...answers };
  const eligibility: EligibilityResult = evaluateEligibility(service.eligibility_rules, mergedAnswers);
  const docs: DocumentRequirement[] = getApplicableDocuments(
    service.required_documents ?? [],
    service.conditional_documents ?? [],
    mergedAnswers
  );

  const handleOfficialPortal = () => {
    trackEvent("official_portal_clicked", { service_id: service.id, slug: service.slug });
    window.open(service.official_url, "_blank", "noopener,noreferrer");
  };

  const handleDownloadPDF = async () => {
    setPdfLoading(true);
    trackEvent("pdf_generated", { service_id: service.id });
    try {
      const res = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ service_slug: service.slug, answers, language }),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `gwh-${service.slug}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("PDF downloaded!");
    } catch {
      toast.error("We couldn't create the PDF right now. You can continue with the official process.");
    } finally {
      setPdfLoading(false);
    }
  };

  const serviceName = t(service.name, language);
  const serviceDesc = t(service.description, language);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      {/* ── Personalized context bar ── */}
      {(guestProfile.age_bracket || guestProfile.category) && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center gap-2 mb-4 text-xs text-gray-500"
        >
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-brand-500" /> Karnataka</span>
          {guestProfile.age_bracket && (
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" /> Age {AGE_LABELS[guestProfile.age_bracket]}
            </span>
          )}
          {guestProfile.category && (
            <span className="flex items-center gap-1 capitalize">
              {guestProfile.category.replace(/-/g, " ")}
            </span>
          )}
          <Link href="/onboarding?redirectTo=back" className="text-brand-600 hover:text-brand-700 ml-1 font-medium underline">
            Edit preferences →
          </Link>
        </motion.div>
      )}

      {/* ── Page header ── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="default" className="capitalize">{service.category.replace(/-/g, " ")}</Badge>
            <Badge variant={service.tier === 1 ? "success" : "default"}>Tier {service.tier}</Badge>
            <VerificationBadge status={service.verification_status} lastVerified={service.last_verified_on} />
          </div>

          {/* Bookmark Button */}
          <button
            onClick={toggleBookmark}
            disabled={bookmarkLoading}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${
              isBookmarked
                ? "bg-brand-50 border-brand-300 text-brand-700 shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            {isBookmarked ? <BookmarkCheck className="w-3.5 h-3.5 text-brand-600" /> : <Bookmark className="w-3.5 h-3.5" />}
            {isBookmarked ? "Saved" : "Save service"}
          </button>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">{serviceName}</h1>
        <p className="text-gray-600 mt-2 max-w-3xl text-sm sm:text-base leading-relaxed">{serviceDesc}</p>
      </div>

      {/* ── Dynamic Single-Question Prompt ── */}
      {service.questions?.length > 0 && eligibility.status === "needs_information" && (
        <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <Card padding="md" className="border-amber-200 bg-amber-50/70 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-900">Answer this quick question to check your eligibility</p>
            </div>
            <div className="space-y-3">
              {service.questions.filter((q) => answers[q.id] === undefined).slice(0, 1).map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-gray-800 mb-2">{t(q.label, language)}</p>
                  {q.type === "boolean" && (
                    <div className="flex gap-2.5">
                      {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
                        <button
                          key={l}
                          onClick={() => handleAnswerChange(q.id, v)}
                          className="flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all
                            border-gray-200 bg-white hover:border-brand-500 hover:bg-brand-50 text-gray-800 shadow-sm"
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "select" && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleAnswerChange(q.id, opt.value)}
                          className="py-2.5 px-3.5 rounded-xl border-2 text-xs font-semibold transition-all text-left
                            border-gray-200 bg-white hover:border-brand-500 hover:bg-brand-50 text-gray-800 shadow-sm"
                        >
                          {t(opt.label, language)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main Guidance Content ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Eligibility Section */}
          <div id="eligibility">
            <Section title="Deterministic Eligibility Check" icon={<CheckCircle2 className="w-4 h-4" />}>
              <EligibilityPanel result={eligibility} />
            </Section>
          </div>

          {/* Documents Section */}
          <div id="documents">
            <Section title="Required & Applicable Documents" icon={<FileText className="w-4 h-4" />}>
              {docs.length === 0 ? (
                <p className="text-sm text-gray-400 italic">
                  Answer the question above to personalize your required document checklist.
                </p>
              ) : (
                <DocumentList docs={docs} language={language} />
              )}
            </Section>
          </div>

          {/* Steps Section */}
          <div id="steps">
            <Section title="Step-by-Step Official Process" icon={<ChevronDown className="w-4 h-4" />}>
              {service.steps?.length > 0 ? (
                <StepsList service={service} language={language} />
              ) : (
                <p className="text-sm text-gray-400">Step breakdown not yet available. Check the official portal.</p>
              )}
            </Section>
          </div>

          {/* What happens after */}
          {service.what_happens_after && (
            <Section title="What Happens After You Apply?" icon={<Clock className="w-4 h-4" />}>
              <p className="text-sm text-gray-600 leading-relaxed">{t(service.what_happens_after, language)}</p>
            </Section>
          )}

          {/* Troubleshooting */}
          {service.troubleshooting?.length > 0 && (
            <div id="troubleshooting">
              <Section title="Common Problems & Solutions" icon={<AlertCircle className="w-4 h-4" />}>
                <TroubleshootingList service={service} language={language} />
              </Section>
            </div>
          )}
        </div>

        {/* ── Sticky Action Sidebar ── */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Official Portal CTA Card */}
            <Card padding="md" className="border-brand-300 bg-brand-50/60 shadow-md">
              <div className="flex items-center gap-1.5 text-xs text-brand-700 font-bold mb-3 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-brand-600" /> Official Government Portal
              </div>
              <Button size="lg" className="w-full font-bold shadow-md shadow-brand-500/20" onClick={handleOfficialPortal}
                rightIcon={<ExternalLink className="w-4 h-4" />}>
                {t(service.official_url_label, language) || "Continue on Official Website"}
              </Button>
              <p className="text-xs text-gray-500 mt-3 text-center leading-relaxed">
                “Citizen tells us what they need. We figure out the path. The official government system completes the transaction.”
              </p>
              {service.last_verified_on && (
                <p className="text-[11px] text-gray-400 text-center mt-2 border-t border-brand-200/50 pt-2">
                  Portal URL verified: {formatDate(service.last_verified_on)}
                </p>
              )}
            </Card>

            {/* Fee Section */}
            <div id="fee">
              <Card padding="md">
                <h3 className="font-bold text-gray-900 text-sm mb-2">Official Government Fee</h3>
                {service.official_fee ? (
                  <>
                    <p className="text-2xl font-extrabold text-gray-900">
                      {service.official_fee.is_free ? (
                        <span className="text-emerald-600">Free (₹0)</span>
                      ) : service.official_fee.amount !== null ? (
                        formatCurrency(service.official_fee.amount)
                      ) : (
                        <span className="text-base text-amber-600 font-semibold">Check Official Portal</span>
                      )}
                    </p>
                    {service.official_fee.notes && (
                      <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">{t(service.official_fee.notes, language)}</p>
                    )}
                  </>
                ) : (
                  <p className="text-xs text-amber-600 flex items-start gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
                    Fee details vary by category. Verify on official portal.
                  </p>
                )}
              </Card>
            </div>

            {/* Pre-filled PDF Summary Card */}
            <Card padding="md">
              <h3 className="font-bold text-gray-900 text-sm mb-1">Pre-filled Guidance PDF</h3>
              <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                Download a reference checklist with your answers and steps to take with you.
              </p>
              <Button variant="outline" size="sm" className="w-full font-semibold" onClick={handleDownloadPDF} loading={pdfLoading}
                leftIcon={<Download className="w-4 h-4" />}>
                Download PDF Summary
              </Button>
            </Card>

            {/* Ask AI Assistant Widget */}
            <Link href={`/chat?q=${encodeURIComponent(`Guide me on ${t(service.name, language)}`)}`}>
              <Card hover padding="md" className="border-dashed text-center bg-gray-50/50">
                <p className="text-sm font-semibold text-brand-600">💬 Ask the Assistant</p>
                <p className="text-xs text-gray-400 mt-0.5">Need help with documents or eligibility?</p>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <Card padding="md" className="shadow-sm">
      <div className="flex items-center gap-2 mb-4 text-brand-600">
        {icon}
        <h2 className="font-bold text-gray-900 text-sm sm:text-base">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function EligibilityPanel({ result }: { result: EligibilityResult }) {
  const colorMap = {
    eligible: "bg-emerald-50 border border-emerald-200 text-emerald-900",
    not_eligible: "bg-red-50 border border-red-200 text-red-900",
    needs_information: "bg-amber-50 border border-amber-200 text-amber-900",
  };
  const icons = {
    eligible: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    not_eligible: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
    needs_information: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />,
  };
  const labels = {
    eligible: "You appear eligible based on verified criteria",
    not_eligible: "You may not meet the eligibility criteria",
    needs_information: "Additional information needed to confirm eligibility",
  };

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`flex items-center gap-2.5 p-3.5 rounded-xl mb-3 shadow-sm ${colorMap[result.status]}`}>
        {icons[result.status]}
        <span className="font-bold text-sm">{labels[result.status]}</span>
      </div>
      {result.reasons.length > 0 && (
        <ul className="space-y-1.5 mb-2 pl-1">
          {result.reasons.map((r, i) => (
            <li key={i} className="text-xs sm:text-sm text-gray-700 flex items-start gap-2">
              <span className="text-brand-500 font-bold mt-0.5">•</span> {r}
            </li>
          ))}
        </ul>
      )}
      {result.missing_fields.length > 0 && (
        <p className="text-xs text-amber-800 bg-amber-50/80 border border-amber-200 rounded-lg px-3 py-2 mt-2">
          Answer the questions above to finalize your eligibility check.
        </p>
      )}
    </motion.div>
  );
}

function DocumentList({ docs, language }: { docs: DocumentRequirement[]; language: string }) {
  return (
    <div className="space-y-2">
      {docs.map((doc) => (
        <div key={doc.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <span className={`mt-0.5 shrink-0 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
            doc.status === "required"
              ? "bg-red-100 text-red-700"
              : doc.status === "optional"
              ? "bg-gray-200 text-gray-700"
              : "bg-amber-100 text-amber-700"
          }`}>
            {doc.status === "required" ? "REQUIRED" : doc.status === "optional" ? "OPTIONAL" : "CONDITIONAL"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900">{t(doc.name, language as "en" | "hi" | "kn")}</p>
            {doc.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t(doc.description, language as "en" | "hi" | "kn")}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}

function StepsList({ service, language }: { service: Service; language: string }) {
  const [expanded, setExpanded] = useState<number | null>(1); // expand step 1 by default
  return (
    <ol className="space-y-2.5">
      {service.steps.map((step) => (
        <li key={step.step_number} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <button
            className="w-full flex items-center gap-3 p-3.5 text-left bg-white hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(expanded === step.step_number ? null : step.step_number)}
            aria-expanded={expanded === step.step_number}
          >
            <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
              {step.step_number}
            </span>
            <span className="font-semibold text-gray-900 text-sm flex-1 text-left">
              {t(step.title, language as "en" | "hi" | "kn")}
            </span>
            {expanded === step.step_number
              ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          <AnimatedStep open={expanded === step.step_number}>
            <div className="px-4 pb-4 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 bg-gray-50/50 pt-3">
              {t(step.description, language as "en" | "hi" | "kn")}
              <div className="flex gap-2 mt-2.5">
                {step.is_online && <Badge variant="default" className="text-[10px]">Online portal</Badge>}
                {step.is_offline && <Badge variant="default" className="text-[10px]">In person counter</Badge>}
              </div>
            </div>
          </AnimatedStep>
        </li>
      ))}
    </ol>
  );
}

function AnimatedStep({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <motion.div
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      style={{ overflow: "hidden" }}
    >
      {children}
    </motion.div>
  );
}

function TroubleshootingList({ service, language }: { service: Service; language: string }) {
  return (
    <div className="space-y-3">
      {service.troubleshooting.map((item, i) => (
        <div key={i} className="p-3.5 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-xs sm:text-sm font-semibold text-gray-900 mb-1.5 flex items-start gap-2">
            <span>❓</span> {t(item.problem, language as "en" | "hi" | "kn")}
          </p>
          {item.defer_to_official ? (
            <div className="flex items-start gap-2 text-xs text-amber-800 bg-amber-50 rounded-lg p-2.5 border border-amber-200">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
              <span>This situation requires official verification. Please contact the official government helpdesk.</span>
            </div>
          ) : (
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed pl-6">{t(item.solution, language as "en" | "hi" | "kn")}</p>
          )}
        </div>
      ))}
    </div>
  );
}
