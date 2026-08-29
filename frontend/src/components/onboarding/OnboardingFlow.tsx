"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight, SkipForward, Check, Sparkles } from "lucide-react";
import { useApp } from "@/components/providers";
import { getSeededServiceBySlug, SEED_SERVICES } from "@/lib/services/seed-data";
import { t } from "@/lib/utils";
import type { AgeGroup, Language, ServiceQuestion } from "@/types";

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
  { value: "voting", label: "Voting", emoji: "🗳️", desc: "Voter ID, Registration" },
  { value: "property-land", label: "Property & Land", emoji: "🏠", desc: "Khata, EC, RTC Pahani" },
  { value: "tax-finance", label: "Tax & Finance", emoji: "🏦", desc: "Property Tax, EPF" },
  { value: "employment-benefits", label: "Employment", emoji: "💼", desc: "EPF, UAN services" },
  { value: "family-marriage", label: "Family & Marriage", emoji: "❤️", desc: "Marriage Certificate" },
  { value: "police-verification", label: "Police & Verification", emoji: "🛡️", desc: "PCC, Clearance" },
  { value: "ration-food", label: "Ration & Food", emoji: "🧺", desc: "Ration Card (Ahara)" },
];

// Services per category for adaptive suggestions
const CATEGORY_SERVICES: Record<string, Array<{ slug: string; label: string; emoji: string }>> = {
  "identity-documents": [
    { slug: "aadhaar-new-enrollment", label: "New Aadhaar", emoji: "🪪" },
    { slug: "aadhaar-update", label: "Aadhaar Update", emoji: "✏️" },
    { slug: "pan-card-new", label: "New PAN Card", emoji: "💳" },
    { slug: "passport", label: "Passport (Fresh/Re-issue)", emoji: "✈️" },
  ],
  "driving-transport": [
    { slug: "driving-licence-renewal", label: "Driving Licence Renewal", emoji: "🔄" },
    { slug: "learners-licence", label: "Learner's Licence (LL)", emoji: "📝" },
    { slug: "permanent-driving-licence", label: "Permanent DL", emoji: "🚗" },
  ],
  "certificates": [
    { slug: "income-certificate", label: "Income Certificate", emoji: "💰" },
    { slug: "caste-certificate", label: "Caste Certificate", emoji: "📋" },
    { slug: "birth-certificate", label: "Birth Certificate", emoji: "👶" },
  ],
  "voting": [
    { slug: "voter-id-new", label: "New Voter ID Card", emoji: "🗳️" },
  ],
  "property-land": [
    { slug: "khata-certificate-transfer", label: "BBMP Khata Transfer", emoji: "🏠" },
    { slug: "encumbrance-certificate", label: "Encumbrance Certificate (EC)", emoji: "📑" },
    { slug: "rtc-pahani", label: "RTC / Pahani (Bhoomi)", emoji: "🌾" },
  ],
  "tax-finance": [
    { slug: "property-tax-bbmp", label: "Property Tax (BBMP)", emoji: "🏦" },
    { slug: "epf-uan-services", label: "EPF / UAN Services", emoji: "💼" },
  ],
  "employment-benefits": [
    { slug: "epf-uan-services", label: "EPF / UAN Services", emoji: "💼" },
  ],
  "family-marriage": [
    { slug: "marriage-certificate", label: "Marriage Registration", emoji: "❤️" },
  ],
  "police-verification": [
    { slug: "police-clearance-certificate", label: "Police Clearance (PCC)", emoji: "🛡️" },
  ],
  "ration-food": [
    { slug: "ration-card", label: "Ration Card (Ahara)", emoji: "🧺" },
  ],
};

function useLabels(lang: Language) {
  const L = {
    en: {
      back: "Back",
      skip: "Skip",
      continue: "Continue",
      done: "View My Personalized Guide →",
      finish: "Finish Setup",
      q_lang: "Which language feels most comfortable?",
      q_state: "Where are you getting this done?",
      q_age: "What age group are you in?",
      q_cat: "What are you here to get done?",
      q_service: "Which specific service do you need?",
      q_dynamic: "A quick question to customize your steps",
    },
    hi: {
      back: "वापस",
      skip: "छोड़ें",
      continue: "आगे बढ़ें",
      done: "मेरी व्यक्तिगत मार्गदर्शिका देखें →",
      finish: "समाप्त करें",
      q_lang: "आप किस भाषा में सहज हैं?",
      q_state: "आप कहाँ से काम करवाना चाहते हैं?",
      q_age: "आपकी आयु वर्ग क्या है?",
      q_cat: "आप क्या काम करवाना चाहते हैं?",
      q_service: "आपको कौन सी सेवा चाहिए?",
      q_dynamic: "आपकी प्रक्रिया को अनुकूलित करने के लिए प्रश्न",
    },
    kn: {
      back: "ಹಿಂದೆ",
      skip: "ಬಿಡಿ",
      continue: "ಮುಂದುವರಿಯಿರಿ",
      done: "ನನ್ನ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ →",
      finish: "ಪೂರ್ಣಗೊಳಿಸಿ",
      q_lang: "ನಿಮಗೆ ಯಾವ ಭಾಷೆ ಹೆಚ್ಚು ಅನುಕೂಲ?",
      q_state: "ನೀವು ಎಲ್ಲಿ ಕೆಲಸ ಮಾಡಿಸಿಕೊಳ್ಳಬೇಕು?",
      q_age: "ನಿಮ್ಮ ವಯಸ್ಸಿನ ಗುಂಪು ಯಾವುದು?",
      q_cat: "ನೀವು ಯಾವ ಕೆಲಸ ಮಾಡಿಸಿಕೊಳ್ಳಬೇಕು?",
      q_service: "ನಿಮಗೆ ಯಾವ ನಿರ್ದಿಷ್ಟ ಸೇವೆ ಬೇಕು?",
      q_dynamic: "ನಿಮ್ಮ ಹಂತಗಳನ್ನು ಕಸ್ಟಮೈಸ್ ಮಾಡಲು ಪ್ರಶ್ನೆ",
    },
  };
  return L[lang] ?? L.en;
}

interface OnboardingFlowProps {
  onComplete?: () => void;
  isModal?: boolean;
}

function OnboardingFlowInner({ onComplete, isModal = false }: OnboardingFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get("redirectTo") ?? "/";
  const { updateGuestProfile, setLanguage, markOnboarded, language: currentLang, guestProfile } = useApp();

  const [mounted, setMounted] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedLang, setSelectedLang] = useState<Language>(currentLang ?? "en");
  const [selectedAge, setSelectedAge] = useState<AgeGroup | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [serviceAnswers, setServiceAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setMounted(true);
    if (guestProfile) {
      if (guestProfile.language) setSelectedLang(guestProfile.language);
      if (guestProfile.age_bracket) setSelectedAge(guestProfile.age_bracket);
      if (guestProfile.category) setSelectedCategory(guestProfile.category);
      if (guestProfile.collected_answers) setServiceAnswers(guestProfile.collected_answers);
    }
  }, [guestProfile]);

  const L = useLabels(selectedLang);

  // Dynamic service questions
  const selectedService = useMemo(() => {
    if (!selectedServiceSlug) return null;
    return getSeededServiceBySlug(selectedServiceSlug);
  }, [selectedServiceSlug]);

  const serviceQuestions: ServiceQuestion[] = useMemo(() => {
    if (!selectedService || !selectedService.questions) return [];
    return selectedService.questions;
  }, [selectedService]);

  // Steps definition
  // 0: language, 1: state, 2: age, 3: category, 4: service (optional), 5..N: service questions (optional)
  const categoryServices = selectedCategory ? (CATEGORY_SERVICES[selectedCategory] ?? []) : [];

  const totalSteps = useMemo(() => {
    let count = 4; // lang, state, age, category
    if (categoryServices.length > 0) {
      count += 1; // service selection step
      if (selectedServiceSlug && serviceQuestions.length > 0) {
        count += Math.min(serviceQuestions.length, 2); // max 2 dynamic questions in onboarding
      }
    }
    return count;
  }, [categoryServices.length, selectedServiceSlug, serviceQuestions.length]);

  const goNext = () => {
    setDirection(1);
    // If at category step and no services, finish
    if (stepIdx === 3 && categoryServices.length === 0) {
      finish();
      return;
    }
    if (stepIdx >= totalSteps - 1) {
      finish();
      return;
    }
    setStepIdx((i) => i + 1);
  };

  const goBack = () => {
    setDirection(-1);
    setStepIdx((i) => Math.max(i - 1, 0));
  };

  const skip = () => {
    updateGuestProfile({
      language: selectedLang,
      age_bracket: selectedAge,
      category: selectedCategory,
      collected_answers: serviceAnswers,
    });
    setLanguage(selectedLang);
    markOnboarded();
    if (onComplete) onComplete();
    else router.push(redirectTo);
  };

  const finish = () => {
    updateGuestProfile({
      language: selectedLang,
      age_bracket: selectedAge,
      category: selectedCategory,
      collected_answers: serviceAnswers,
    });
    setLanguage(selectedLang);
    markOnboarded();
    if (onComplete) {
      onComplete();
      if (selectedServiceSlug) router.push(`/services/${selectedServiceSlug}`);
    } else if (selectedServiceSlug) {
      router.push(`/services/${selectedServiceSlug}`);
    } else {
      router.push(redirectTo);
    }
  };

  const pickLang = (lang: Language) => {
    setSelectedLang(lang);
    setLanguage(lang);
    setTimeout(goNext, 250);
  };

  const pickAge = (age: AgeGroup) => {
    setSelectedAge(age);
    setTimeout(goNext, 250);
  };

  const pickCategory = (cat: string) => {
    setSelectedCategory(cat);
    setSelectedServiceSlug(null);
    setTimeout(goNext, 250);
  };

  const pickService = (slug: string) => {
    setSelectedServiceSlug(slug);
    const svc = getSeededServiceBySlug(slug);
    if (svc && svc.questions && svc.questions.length > 0) {
      setTimeout(goNext, 250);
    } else {
      setTimeout(finish, 250);
    }
  };

  const answerQuestion = (qId: string, value: unknown) => {
    setServiceAnswers((prev) => ({ ...prev, [qId]: value }));
    setTimeout(goNext, 250);
  };

  // Determine current step view
  let currentStepView: "language" | "state" | "age" | "category" | "service" | "dynamic_question" = "language";
  let activeQuestion: ServiceQuestion | null = null;

  if (stepIdx === 0) currentStepView = "language";
  else if (stepIdx === 1) currentStepView = "state";
  else if (stepIdx === 2) currentStepView = "age";
  else if (stepIdx === 3) currentStepView = "category";
  else if (stepIdx === 4 && categoryServices.length > 0) currentStepView = "service";
  else if (stepIdx >= 5 && serviceQuestions.length > 0) {
    currentStepView = "dynamic_question";
    activeQuestion = serviceQuestions[stepIdx - 5] ?? null;
  }

  const progress = Math.min((stepIdx + 1) / Math.max(totalSteps, 1), 1);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * 28 }),
  };

  return (
    <div className={`w-full max-w-lg mx-auto ${isModal ? "p-4 sm:p-6" : "min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0d1326] to-[#0a0f1e] flex flex-col items-center justify-center px-4 py-8"}`}>
      {/* Glow */}
      {!isModal && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-600/15 rounded-full blur-[100px]" />
        </div>
      )}

      <div className={`relative z-10 w-full ${isModal ? "" : "bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-8 shadow-2xl"}`}>
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-brand-400 uppercase">
              Step {stepIdx + 1} of {totalSteps}
            </span>
            <button
              onClick={skip}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              <SkipForward className="w-3.5 h-3.5" /> {L.skip}
            </button>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-brand-500 via-purple-400 to-brand-400 rounded-full"
              animate={{ width: `${progress * 100}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Step Card Contents */}
        <div className="relative overflow-hidden" style={{ minHeight: 340 }}>
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={stepIdx}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              {/* 1. Language */}
              {currentStepView === "language" && (
                <StepShell title={L.q_lang}>
                  <div className="space-y-3">
                    {LANGUAGES.map((lang) => (
                      <OptionCard
                        key={lang.value}
                        selected={selectedLang === lang.value}
                        onClick={() => pickLang(lang.value)}
                      >
                        <span className="text-2xl">{lang.flag}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-white text-base">{lang.native}</p>
                          <p className="text-xs text-gray-400">{lang.label}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* 2. State */}
              {currentStepView === "state" && (
                <StepShell title={L.q_state}>
                  <OptionCard selected onClick={goNext}>
                    <span className="text-3xl">🇮🇳</span>
                    <div className="flex-1">
                      <p className="font-bold text-white text-base">Karnataka</p>
                      <p className="text-xs text-gray-400">Launch State · All 31 Districts Supported</p>
                    </div>
                    <span className="text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2.5 py-1 rounded-full">
                      Selected
                    </span>
                  </OptionCard>
                </StepShell>
              )}

              {/* 3. Age Group */}
              {currentStepView === "age" && (
                <StepShell title={L.q_age}>
                  <div className="grid grid-cols-2 gap-2.5">
                    {AGE_GROUPS.map((ag) => (
                      <OptionCard
                        key={ag.value}
                        selected={selectedAge === ag.value}
                        onClick={() => pickAge(ag.value)}
                        compact
                      >
                        <div>
                          <p className="font-bold text-white text-sm">{ag.label}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{ag.sub}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* 4. Category */}
              {currentStepView === "category" && (
                <StepShell title={L.q_cat}>
                  <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-1">
                    {CATEGORIES.map((cat) => (
                      <OptionCard
                        key={cat.value}
                        selected={selectedCategory === cat.value}
                        onClick={() => pickCategory(cat.value)}
                        compact
                      >
                        <span className="text-xl shrink-0">{cat.emoji}</span>
                        <div className="min-w-0">
                          <p className="font-semibold text-white text-xs leading-tight truncate">{cat.label}</p>
                          <p className="text-[10px] text-gray-400 leading-tight mt-0.5 truncate">{cat.desc}</p>
                        </div>
                      </OptionCard>
                    ))}
                  </div>
                </StepShell>
              )}

              {/* 5. Service Suggestions */}
              {currentStepView === "service" && (
                <StepShell title={L.q_service}>
                  <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                    {categoryServices.map((svc) => (
                      <OptionCard
                        key={svc.slug}
                        selected={selectedServiceSlug === svc.slug}
                        onClick={() => pickService(svc.slug)}
                      >
                        <span className="text-xl">{svc.emoji}</span>
                        <p className="font-semibold text-white text-sm flex-1">{svc.label}</p>
                      </OptionCard>
                    ))}
                    <button
                      onClick={finish}
                      className="w-full text-xs text-gray-400 hover:text-brand-300 text-center py-2 transition-colors mt-2"
                    >
                      Not listed / explore all services →
                    </button>
                  </div>
                </StepShell>
              )}

              {/* 6. Dynamic Service-Specific Question */}
              {currentStepView === "dynamic_question" && activeQuestion && (
                <StepShell title={t(activeQuestion.label, selectedLang)}>
                  <div className="space-y-3">
                    {activeQuestion.type === "boolean" && (
                      <div className="grid grid-cols-2 gap-3">
                        <OptionCard
                          selected={serviceAnswers[activeQuestion.id] === true}
                          onClick={() => answerQuestion(activeQuestion!.id, true)}
                        >
                          <p className="font-bold text-white text-center w-full">Yes</p>
                        </OptionCard>
                        <OptionCard
                          selected={serviceAnswers[activeQuestion.id] === false}
                          onClick={() => answerQuestion(activeQuestion!.id, false)}
                        >
                          <p className="font-bold text-white text-center w-full">No</p>
                        </OptionCard>
                      </div>
                    )}
                    {activeQuestion.type === "select" && activeQuestion.options && (
                      <div className="space-y-2">
                        {activeQuestion.options.map((opt) => (
                          <OptionCard
                            key={opt.value}
                            selected={serviceAnswers[activeQuestion!.id] === opt.value}
                            onClick={() => answerQuestion(activeQuestion!.id, opt.value)}
                          >
                            <p className="font-medium text-white text-sm">{t(opt.label, selectedLang)}</p>
                          </OptionCard>
                        ))}
                      </div>
                    )}
                  </div>
                </StepShell>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Footer */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
          <button
            onClick={goBack}
            disabled={stepIdx === 0}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white disabled:opacity-0 disabled:pointer-events-none transition-colors"
          >
            <ChevronLeft className="w-4 h-4" /> {L.back}
          </button>

          <button
            onClick={goNext}
            className="flex items-center gap-2 text-xs font-semibold bg-brand-500 hover:bg-brand-400 active:scale-95 text-white px-4 py-2 rounded-xl transition-all shadow-md shadow-brand-500/20"
          >
            {stepIdx >= totalSteps - 1 ? L.done : L.continue}
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StepShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-white mb-5 leading-snug">{title}</h2>
      <div>{children}</div>
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
      className={`w-full flex items-center gap-3 rounded-2xl border text-left transition-all duration-200
        ${compact ? "p-3" : "px-4 py-3.5"}
        ${selected
          ? "border-brand-500 bg-brand-500/20 shadow-[0_0_0_3px_rgba(79,110,247,0.2)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
        }`}
    >
      {children}
      {selected && (
        <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-brand-500 flex items-center justify-center shadow-sm">
          <Check className="w-3 h-3 text-white" strokeWidth={3} />
        </span>
      )}
    </motion.button>
  );
}

export function OnboardingFlow(props: OnboardingFlowProps) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0f1e]" />}>
      <OnboardingFlowInner {...props} />
    </Suspense>
  );
}
