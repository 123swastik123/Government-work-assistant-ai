"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight, SkipForward, Check } from "lucide-react";
import { useApp } from "@/components/providers";
import type { AgeGroup, Language } from "@/types";

// ─── Data ──────────────────────────────────────────────────────

const LANGUAGES = [
  { value: "en" as Language, label: "English", native: "English", flag: "🇬🇧" },
  { value: "hi" as Language, label: "Hindi", native: "हिन्दी", flag: "🇮🇳" },
  { value: "kn" as Language, label: "Kannada", native: "ಕನ್ನಡ", flag: "🇮🇳" },
];

const AGE_GROUPS = [
  { value: "under_18" as AgeGroup, label: "Under 18", sub: "Minor" },
  { value: "18_25" as AgeGroup, label: "18 – 25", sub: "Young adult" },
  { value: "26_35" as AgeGroup, label: "26 – 35", sub: "Adult" },
  { value: "36_50" as AgeGroup, label: "36 – 50", sub: "Adult" },
  { value: "51_60" as AgeGroup, label: "51 – 60", sub: "Senior" },
  { value: "60_plus" as AgeGroup, label: "60+", sub: "Senior" },
];

const CATEGORIES = [
  { value: "identity-documents", label: "Identity & Documents", emoji: "🪪", desc: "Aadhaar, PAN, Passport" },
  { value: "driving-transport", label: "Driving & Transport", emoji: "🚗", desc: "Licence, RC, Vehicle" },
  { value: "certificates", label: "Certificates", emoji: "📋", desc: "Income, Caste, Birth" },
  { value: "voting", label: "Voting", emoji: "🗳️", desc: "Voter ID, Corrections" },
  { value: "property-land", label: "Property & Land", emoji: "🏠", desc: "Khata, EC, RTC" },
  { value: "tax-finance", label: "Tax & Finance", emoji: "🏦", desc: "Property Tax, EPF" },
  { value: "employment-benefits", label: "Employment", emoji: "💼", desc: "EPF, UAN services" },
  { value: "family-marriage", label: "Family & Marriage", emoji: "❤️", desc: "Marriage, Legal Heir" },
  { value: "police-verification", label: "Police & Verification", emoji: "🛡️", desc: "PCC, Clearance" },
  { value: "health-disability", label: "Health & Disability", emoji: "🏥", desc: "Disability Certificate" },
  { value: "ration-food", label: "Ration & Food", emoji: "🧺", desc: "Ration Card" },
  { value: "other", label: "Other", emoji: "⋯", desc: "Something else" },
];

// Services per category for adaptive suggestions
const CATEGORY_SERVICES: Record<string, Array<{ slug: string; label: string; emoji: string }>> = {
  "identity-documents": [
    { slug: "aadhaar-new-enrollment", label: "New Aadhaar", emoji: "🪪" },
    { slug: "aadhaar-update", label: "Aadhaar Update", emoji: "✏️" },
    { slug: "pan-card-new", label: "New PAN Card", emoji: "💳" },
    { slug: "pan-card-correction", label: "PAN Correction", emoji: "🔧" },
    { slug: "passport", label: "Passport", emoji: "✈️" },
  ],
  "driving-transport": [
    { slug: "learners-licence", label: "Learner's Licence", emoji: "📝" },
    { slug: "permanent-driving-licence", label: "Permanent DL", emoji: "🚗" },
    { slug: "driving-licence-renewal", label: "DL Renewal", emoji: "🔄" },
    { slug: "duplicate-driving-licence", label: "Duplicate DL", emoji: "📄" },
    { slug: "dl-correction", label: "DL Correction", emoji: "🔧" },
    { slug: "vehicle-rc-new", label: "Vehicle RC", emoji: "🚙" },
    { slug: "vehicle-rc-transfer", label: "RC Transfer", emoji: "🔄" },
  ],
  "certificates": [
    { slug: "income-certificate", label: "Income Certificate", emoji: "💰" },
    { slug: "caste-certificate", label: "Caste Certificate", emoji: "📋" },
    { slug: "birth-certificate", label: "Birth Certificate", emoji: "👶" },
    { slug: "death-certificate", label: "Death Certificate", emoji: "📄" },
    { slug: "domicile-certificate", label: "Domicile / Residence", emoji: "🏠" },
    { slug: "legal-heir-certificate", label: "Legal Heir", emoji: "⚖️" },
    { slug: "non-creamy-layer-certificate", label: "Non-Creamy Layer", emoji: "📋" },
  ],
  "voting": [
    { slug: "voter-id-new", label: "New Voter ID", emoji: "🗳️" },
    { slug: "voter-id-correction", label: "Voter ID Correction", emoji: "✏️" },
  ],
  "property-land": [
    { slug: "khata-certificate-transfer", label: "Khata Certificate", emoji: "🏠" },
    { slug: "encumbrance-certificate", label: "Encumbrance Certificate", emoji: "📑" },
    { slug: "rtc-pahani", label: "RTC / Pahani", emoji: "🌾" },
  ],
  "tax-finance": [
    { slug: "property-tax-bbmp", label: "Property Tax (BBMP)", emoji: "🏦" },
    { slug: "epf-uan-services", label: "EPF / UAN Services", emoji: "💼" },
  ],
  "employment-benefits": [
    { slug: "epf-uan-services", label: "EPF / UAN Services", emoji: "💼" },
  ],
  "family-marriage": [
    { slug: "marriage-certificate", label: "Marriage Certificate", emoji: "❤️" },
    { slug: "legal-heir-certificate", label: "Legal Heir Certificate", emoji: "⚖️" },
  ],
  "police-verification": [
    { slug: "police-clearance-certificate", label: "Police Clearance", emoji: "🛡️" },
  ],
  "health-disability": [
    { slug: "disability-certificate", label: "Disability Certificate", emoji: "♿" },
  ],
  "ration-food": [
    { slug: "ration-card", label: "Ration Card", emoji: "🧺" },
  ],
  "other": [],
};

// ─── Step types ────────────────────────────────────────────────
type StepId = "language" | "state" | "age" | "category" | "service";

interface Selections {
  language: Language;
  age_bracket: AgeGroup | null;
  category: string | null;
  service_slug: string | null;
}

// ─── Labels ────────────────────────────────────────────────────
function useLabels(lang: Language) {
  const L = {
    en: { back: "Back", skip: "Skip", done: "Get started", q_lang: "Which language feels most comfortable?", q_state: "Where are you getting this done?", q_age: "What age group are you in?", q_cat: "What are you here to get done?", q_service: "Which service do you need?" },
    hi: { back: "वापस", skip: "छोड़ें", done: "शुरू करें", q_lang: "आप किस भाषा में सहज हैं?", q_state: "आप कहाँ से काम करवाना चाहते हैं?", q_age: "आपकी आयु वर्ग क्या है?", q_cat: "आप क्या काम करवाना चाहते हैं?", q_service: "आपको कौन सी सेवा चाहिए?" },
    kn: { back: "ಹಿಂದೆ", skip: "ಬಿಡಿ", done: "ಪ್ರಾರಂಭಿಸಿ", q_lang: "ನಿಮಗೆ ಯಾವ ಭಾಷೆ ಅನುಕೂಲ?", q_state: "ನೀವು ಎಲ್ಲಿ ಕೆಲಸ ಮಾಡಿಸಿಕೊಳ್ಳಬೇಕು?", q_age: "ನಿಮ್ಮ ವಯಸ್ಸಿನ ಗುಂಪು?", q_cat: "ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡಿಸಿಕೊಳ್ಳಬೇಕು?", q_service: "ನಿಮಗೆ ಯಾವ ಸೇವೆ ಬೇಕು?" },
  };
  return L[lang] ?? L.en;
}

// ─── Main component ────────────────────────────────────────────
function OnboardingFlowInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/";
  const { updateGuestProfile, setLanguage, markOnboarded, language: currentLang, guestProfile } = useApp();

  const STEPS: StepId[] = ["language", "state", "age", "category", "service"];

  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState(1); // 1=forward, -1=back
  const [selections, setSelections] = useState<Selections>({
    language: currentLang,
    age_bracket: guestProfile.age_bracket,
    category: guestProfile.category,
    service_slug: null,
  });

  const currentStep = STEPS[stepIdx];
  const L = useLabels(selections.language);
  const categoryServices = selections.category ? (CATEGORY_SERVICES[selections.category] ?? []) : [];

  const goNext = () => {
    setDirection(1);
    // Skip service step if category has no services or is "other"
    if (STEPS[stepIdx + 1] === "service" && categoryServices.length === 0) {
      finish();
      return;
    }
    setStepIdx((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStepIdx((i) => Math.max(i - 1, 0));
  };

  const skip = () => {
    // Save whatever we have so far
    updateGuestProfile({ language: selections.language, age_bracket: selections.age_bracket, category: selections.category });
    setLanguage(selections.language);
    markOnboarded();
    router.push(redirectTo);
  };

  const finish = () => {
    updateGuestProfile({ language: selections.language, age_bracket: selections.age_bracket, category: selections.category });
    setLanguage(selections.language);
    markOnboarded();
    if (selections.service_slug) {
      router.push(`/services/${selections.service_slug}`);
    } else {
      router.push(redirectTo);
    }
  };

  const pick = <K extends keyof Selections>(key: K, value: Selections[K], autoAdvance = true) => {
    setSelections((p) => ({ ...p, [key]: value }));
    if (autoAdvance) setTimeout(goNext, 280);
  };

  // Progress — exclude "service" step from count if category has no services
  const visibleSteps = categoryServices.length > 0 ? STEPS.length : STEPS.length - 1;
  const progress = Math.min(stepIdx / (visibleSteps - 1), 1);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 32 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * 32 }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1326] to-[#0a0f1e] flex flex-col items-center justify-center px-4 py-8">
      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-gray-500">
              Step {stepIdx + 1} of {visibleSteps}
            </span>
            <button onClick={skip} className="text-xs text-gray-500 hover:text-gray-300 flex items-center gap-1 transition-colors">
              <SkipForward className="w-3 h-3" /> {L.skip}
            </button>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>
        </div>

        {/* Step content */}
        <div className="relative overflow-hidden" style={{ minHeight: 380 }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={currentStep}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.28, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {/* Language */}
              {currentStep === "language" && (
                <StepShell title={L.q_lang}>
                  <div className="space-y-2.5">
                    {LANGUAGES.map((lang) => (
                      <OptionCard
                        key={lang.value}
                        selected={selections.language === lang.value}
                        onClick={() => pick("language", lang.value)}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white">{lang.native}</p>
                          <p className="text-xs text-gray-400">{lang.label}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* State */}
              {currentStep === "state" && (
                <StepShell title={L.q_state}>
                  <OptionCard selected onClick={goNext}>
                    <span className="text-3xl">🇮🇳</span>
                    <div className="flex-1">
                      <p className="font-semibold text-white">Karnataka</p>
                      <p className="text-xs text-gray-400">Pilot state · More coming soon</p>
                    </div>
                    <span className="text-xs bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 rounded-full">Pre-selected</span>
                  </OptionCard>
                </StepShell>
              )}

              {/* Age */}
              {currentStep === "age" && (
                <StepShell title={L.q_age}>
                  <div className="grid grid-cols-2 gap-2.5">
                    {AGE_GROUPS.map((ag) => (
                      <OptionCard
                        key={ag.value}
                        selected={selections.age_bracket === ag.value}
                        onClick={() => pick("age_bracket", ag.value)}
                        compact
                      >
                        <p className="font-bold text-white text-sm">{ag.label}</p>
                        <p className="text-xs text-gray-500">{ag.sub}</p>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Category */}
              {currentStep === "category" && (
                <StepShell title={L.q_cat}>
                  <div className="grid grid-cols-2 gap-2">
                    {CATEGORIES.map((cat) => (
                      <OptionCard
                        key={cat.value}
                        selected={selections.category === cat.value}
                        onClick={() => pick("category", cat.value)}
                        compact
                      >
                        <span className="text-xl">{cat.emoji}</span>
                        <div>
                          <p className="font-semibold text-white text-xs leading-tight">{cat.label}</p>
                          <p className="text-[10px] text-gray-500 leading-tight mt-0.5">{cat.desc}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* Service (adaptive — only shown if category has services) */}
              {currentStep === "service" && categoryServices.length > 0 && (
                <StepShell title={L.q_service}>
                  <div className="space-y-2">
                    {categoryServices.map((svc) => (
                      <OptionCard
                        key={svc.slug}
                        selected={selections.service_slug === svc.slug}
                        onClick={() => { setSelections((p) => ({ ...p, service_slug: svc.slug })); setTimeout(finish, 280); }}
                      >
                        <span className="text-xl">{svc.emoji}</span>
                        <p className="font-medium text-white text-sm flex-1">{svc.label}</p>
                      </OptionCard>
                    ))}
                    <button
                      onClick={finish}
                      className="w-full text-sm text-gray-500 hover:text-gray-300 text-center py-2 transition-colors"
                    >
                      Not sure / see all services →
                    </button>
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom nav */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/5">
          <button
            onClick={goBack}
            disabled={stepIdx === 0}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-300 disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {L.back}
          </button>

          {currentStep !== "service" && (
            <button
              onClick={goNext}
              className="flex items-center gap-1.5 text-sm font-medium text-brand-400 hover:text-brand-300 transition-colors"
            >
              {stepIdx === visibleSteps - 1 ? L.done : "Continue"} <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Context summary — show already collected info */}
        {(selections.language !== "en" || selections.age_bracket || selections.category) && (
          <div className="mt-5 flex flex-wrap gap-1.5 justify-center">
            {selections.language !== "en" && (
              <Pill>{LANGUAGES.find(l => l.value === selections.language)?.native}</Pill>
            )}
            {selections.age_bracket && (
              <Pill>{AGE_GROUPS.find(a => a.value === selections.age_bracket)?.label}</Pill>
            )}
            {selections.category && (
              <Pill>{CATEGORIES.find(c => c.value === selections.category)?.label}</Pill>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────
function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 leading-snug">{title}</h1>
      <div className="max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">{children}</div>
    </div>
  );
}

function OptionCard({
  selected, onClick, children, compact,
}: {
  selected: boolean; onClick: () => void; children: React.ReactNode; compact?: boolean;
}) {
  return (
    <motion.button
      onClick={onClick}
      whileTap={{ scale: 0.97 }}
      className={`w-full flex items-center gap-3 rounded-xl border-2 text-left transition-all duration-200
        ${compact ? "p-3" : "px-4 py-3.5"}
        ${selected
          ? "border-brand-500 bg-brand-500/10 shadow-[0_0_0_4px_rgba(79,110,247,0.1)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8"
        }`}
    >
      {children}
      {selected && (
        <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
    </motion.button>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-xs text-gray-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">
      {children}
    </span>
  );
}

export function OnboardingFlow() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e]" />}>
      <OnboardingFlowInner />
    </Suspense>
  );
}
