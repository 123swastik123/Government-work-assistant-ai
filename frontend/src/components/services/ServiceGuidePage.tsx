"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2, AlertCircle, XCircle, FileText, ExternalLink,
  Download, ChevronDown, ChevronUp, ShieldCheck, Info,
  AlertTriangle, User, MapPin, Clock
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
  const { language, guestProfile } = useApp();
  const [answers, setAnswers] = useState<Record<string, unknown>>(guestProfile.collected_answers ?? {});
  const [pdfLoading, setPdfLoading] = useState(false);

  const mergedAnswers = { ...guestProfile, ...answers };

  const eligibility: EligibilityResult = evaluateEligibility(service.eligibility_rules, mergedAnswers);
  const docs: DocumentRequirement[] = getApplicableDocuments(
    service.required_documents, service.conditional_documents, mergedAnswers
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
      a.href = url; a.download = `gwh-${service.slug}.pdf`; a.click();
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
          <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> Karnataka</span>
          {guestProfile.age_bracket && (
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" /> Age {AGE_LABELS[guestProfile.age_bracket]}
            </span>
          )}
          {guestProfile.category && (
            <span className="flex items-center gap-1 capitalize">
              {guestProfile.category.replace(/-/g, " ")}
            </span>
          )}
          <Link href="/onboarding?redirectTo=back" className="text-brand-500 hover:text-brand-600 ml-1">
            Edit preferences →
          </Link>
        </motion.div>
      )}

      {/* ── Page header ── */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="default" className="capitalize">{service.category.replace(/-/g, " ")}</Badge>
          <Badge variant={service.tier === 1 ? "success" : "default"}>Tier {service.tier}</Badge>
          <VerificationBadge status={service.verification_status} lastVerified={service.last_verified_on} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">{serviceName}</h1>
        <p className="text-gray-500 mt-2 max-w-2xl text-sm sm:text-base">{serviceDesc}</p>
      </div>

      {/* ── Service questions (inline) ── */}
      {service.questions?.length > 0 && eligibility.status === "needs_information" && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Card padding="md" className="border-amber-200 bg-amber-50">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <p className="text-sm font-semibold text-amber-800">Answer a few questions to personalize this guide</p>
            </div>
            <div className="space-y-3">
              {service.questions.filter(q => !answers[q.id]).slice(0, 1).map((q) => (
                <div key={q.id}>
                  <p className="text-sm font-medium text-gray-800 mb-2">{t(q.label, language)}</p>
                  {q.type === "boolean" && (
                    <div className="flex gap-2">
                      {[{ v: true, l: "Yes" }, { v: false, l: "No" }].map(({ v, l }) => (
                        <button key={l} onClick={() => setAnswers(a => ({ ...a, [q.id]: v }))}
                          className="flex-1 py-2 rounded-lg border-2 text-sm font-medium transition-all
                            border-gray-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-gray-700">
                          {l}
                        </button>
                      ))}
                    </div>
                  )}
                  {q.type === "select" && q.options && (
                    <div className="grid grid-cols-2 gap-2">
                      {q.options.map((opt) => (
                        <button key={opt.value} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt.value }))}
                          className="py-2 px-3 rounded-lg border-2 text-xs font-medium transition-all text-left
                            border-gray-200 bg-white hover:border-brand-400 hover:bg-brand-50 text-gray-700">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Eligibility */}
          <Section title="Your eligibility" icon={<CheckCircle2 className="w-4 h-4" />}>
            <EligibilityPanel result={eligibility} />
          </Section>

          {/* Documents */}
          <Section title="Documents you need" icon={<FileText className="w-4 h-4" />}>
            {docs.length === 0 ? (
              <p className="text-sm text-gray-400 italic">
                Answer the questions above to personalize your document checklist.
              </p>
            ) : (
              <DocumentList docs={docs} language={language} />
            )}
          </Section>

          {/* Steps */}
          <Section title="What you need to do" icon={<ChevronDown className="w-4 h-4" />}>
            {service.steps?.length > 0 ? (
              <StepsList service={service} language={language} />
            ) : (
              <p className="text-sm text-gray-400">Steps not yet available. Check the official portal.</p>
            )}
          </Section>

          {/* What happens after */}
          {service.what_happens_after && (
            <Section title="What happens after you apply?" icon={<Clock className="w-4 h-4" />}>
              <p className="text-sm text-gray-600 leading-relaxed">{t(service.what_happens_after, language)}</p>
            </Section>
          )}

          {/* Troubleshooting */}
          {service.troubleshooting?.length > 0 && (
            <Section title="Common problems" icon={<AlertCircle className="w-4 h-4" />}>
              <TroubleshootingList service={service} language={language} />
            </Section>
          )}
        </div>

        {/* ── Sticky sidebar ── */}
        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24 space-y-4">

            {/* Verification status */}
            <Card padding="md" className={service.verification_status === "verified"
              ? "border-emerald-200 bg-emerald-50"
              : "border-amber-200 bg-amber-50"
            }>
              <div className="flex items-start gap-3">
                <ShieldCheck className={`w-5 h-5 mt-0.5 shrink-0 ${service.verification_status === "verified" ? "text-emerald-600" : "text-amber-600"}`} />
                <div>
                  <p className={`text-sm font-semibold ${service.verification_status === "verified" ? "text-emerald-800" : "text-amber-800"}`}>
                    {service.verification_status === "verified" ? "Verified information" : "Needs verification"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {service.verification_status === "verified"
                      ? `Last verified: ${formatDate(service.last_verified_on)}`
                      : "Check the official portal for the latest information"}
                  </p>
                </div>
              </div>
            </Card>

            {/* Fee */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Official fee</h3>
              {service.official_fee ? (
                <>
                  <p className="text-2xl font-bold text-gray-900">
                    {service.official_fee.is_free ? "Free"
                      : service.official_fee.amount !== null
                        ? formatCurrency(service.official_fee.amount)
                        : <span className="text-base text-amber-600">Check portal</span>}
                  </p>
                  {service.official_fee.notes && (
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{t(service.official_fee.notes, language)}</p>
                  )}
                  {!service.official_fee.is_free && service.official_fee.amount === null && (
                    <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      Fee not yet verified — check official portal
                    </p>
                  )}
                </>
              ) : (
                <p className="text-sm text-amber-600 flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                  Fee information needs verification. Check the official portal.
                </p>
              )}
            </Card>

            {/* PDF */}
            <Card padding="md">
              <h3 className="font-semibold text-gray-900 text-sm mb-1">Pre-filled summary PDF</h3>
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                Download a summary for your reference. Submit through the official portal only.
              </p>
              <Button variant="outline" size="sm" className="w-full" onClick={handleDownloadPDF} loading={pdfLoading}
                leftIcon={<Download className="w-4 h-4" />}>
                Download PDF
              </Button>
            </Card>

            {/* Official portal CTA */}
            <Card padding="md" className="border-brand-300 bg-brand-50">
              <div className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold mb-3">
                <ShieldCheck className="w-4 h-4" /> Official Government Portal
              </div>
              <Button size="md" className="w-full font-semibold" onClick={handleOfficialPortal}
                rightIcon={<ExternalLink className="w-4 h-4" />}>
                {t(service.official_url_label, language) || "Continue on Official Website"}
              </Button>
              <p className="text-xs text-gray-500 mt-2 text-center leading-relaxed">
                Government Work Helper does not submit applications.
                You complete the transaction on the official portal.
              </p>
              {service.last_verified_on && (
                <p className="text-xs text-gray-400 text-center mt-1">
                  URL verified: {formatDate(service.last_verified_on)}
                </p>
              )}
            </Card>

            {/* Ask assistant */}
            <Link href={`/chat?q=${encodeURIComponent(`Help me with ${t(service.name, language)}`)}`}>
              <Card hover padding="md" className="border-dashed text-center">
                <p className="text-sm font-medium text-brand-600">💬 Ask the assistant</p>
                <p className="text-xs text-gray-400 mt-0.5">Get personalized guidance for this service</p>
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
    <Card padding="md">
      <div className="flex items-center gap-2 mb-4 text-brand-600">
        {icon}
        <h2 className="font-semibold text-gray-900 text-sm sm:text-base">{title}</h2>
      </div>
      {children}
    </Card>
  );
}

function EligibilityPanel({ result }: { result: EligibilityResult }) {
  const colorMap = {
    eligible: "bg-emerald-50 border border-emerald-200 text-emerald-800",
    not_eligible: "bg-red-50 border border-red-200 text-red-800",
    needs_information: "bg-amber-50 border border-amber-200 text-amber-800",
  };
  const icons = { eligible: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />, not_eligible: <XCircle className="w-5 h-5 text-red-600 shrink-0" />, needs_information: <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" /> };
  const labels = { eligible: "You appear eligible", not_eligible: "You may not meet the criteria", needs_information: "We need a bit more information" };

  return (
    <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
      <div className={`flex items-center gap-2.5 p-3.5 rounded-xl mb-3 ${colorMap[result.status]}`}>
        {icons[result.status]}
        <span className="font-semibold text-sm">{labels[result.status]}</span>
      </div>
      {result.reasons.length > 0 && (
        <ul className="space-y-1.5 mb-2">
          {result.reasons.map((r, i) => (
            <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
              <span className="text-gray-300 mt-1">•</span> {r}
            </li>
          ))}
        </ul>
      )}
      {result.missing_fields.length > 0 && (
        <p className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2 mt-2">
          Answer the questions above to complete your eligibility check.
        </p>
      )}
    </motion.div>
  );
}

function DocumentList({ docs, language }: { docs: DocumentRequirement[]; language: string }) {
  return (
    <motion.ul initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-2">
      {docs.map((doc) => (
        <motion.li key={doc.id} variants={{ hidden: { opacity: 0, x: -8 }, visible: { opacity: 1, x: 0 } }}
          className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
          <span className={`mt-0.5 shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${doc.status === "required" ? "bg-red-100 text-red-600" : "bg-gray-100 text-gray-400"}`}>
            {doc.status === "required" ? "REQ" : doc.status === "optional" ? "OPT" : "COND"}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-gray-800">{t(doc.name, language as "en" | "hi" | "kn")}</p>
            {doc.description && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{t(doc.description, language as "en" | "hi" | "kn")}</p>}
          </div>
        </motion.li>
      ))}
    </motion.ul>
  );
}

function StepsList({ service, language }: { service: Service; language: string }) {
  const [expanded, setExpanded] = useState<number | null>(null);
  return (
    <ol className="space-y-2">
      {service.steps.map((step) => (
        <li key={step.step_number} className="border border-gray-100 rounded-xl overflow-hidden">
          <button
            className="w-full flex items-center gap-3 p-3.5 text-left hover:bg-gray-50 transition-colors"
            onClick={() => setExpanded(expanded === step.step_number ? null : step.step_number)}
            aria-expanded={expanded === step.step_number}
          >
            <span className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center shrink-0">
              {step.step_number}
            </span>
            <span className="font-medium text-gray-800 text-sm flex-1 text-left">
              {t(step.title, language as "en" | "hi" | "kn")}
            </span>
            {expanded === step.step_number
              ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
          </button>
          <AnimatedStep open={expanded === step.step_number}>
            <div className="px-4 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-50 pt-3">
              {t(step.description, language as "en" | "hi" | "kn")}
              <div className="flex gap-2 mt-2">
                {step.is_online && <Badge variant="default" className="text-xs">Online</Badge>}
                {step.is_offline && <Badge variant="default" className="text-xs">In person</Badge>}
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
        <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
          <p className="text-sm font-semibold text-gray-800 mb-2 flex items-start gap-2">
            <span>❓</span> {t(item.problem, language as "en" | "hi" | "kn")}
          </p>
          {item.defer_to_official ? (
            <div className="flex items-start gap-2 text-sm text-amber-700 bg-amber-50 rounded-lg px-3 py-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>This situation requires official guidance. Please visit the official government portal or in-person helpdesk.</span>
            </div>
          ) : (
            <p className="text-sm text-gray-600 leading-relaxed">{t(item.solution, language as "en" | "hi" | "kn")}</p>
          )}
        </div>
      ))}
    </div>
  );
}
