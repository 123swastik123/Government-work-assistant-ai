"use client";
import { useState, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ArrowRight, Check, Building2, MapPin, ShieldCheck, Languages, FileText, Car, Vote, House, Landmark, BriefcaseBusiness, HeartHandshake, Scale, GraduationCap, HandHeart, Wheat, type LucideIcon } from "lucide-react";
import { useApp } from "@/components/providers";
import { NammaMark } from "@/components/brand/NammaMark";
import { getSeededServiceBySlug } from "@/lib/services/seed-data";
import { t } from "@/lib/utils";
import type { AgeGroup, Language, ServiceQuestion } from "@/types";

// ─── Data ──────────────────────────────────────────────────────

const LANGUAGES = [
  { value: "en" as Language, label: "English", native: "English", code: "EN" },
  { value: "hi" as Language, label: "Hindi", native: "हिन्दी", code: "हि" },
  { value: "kn" as Language, label: "Kannada", native: "ಕನ್ನಡ", code: "ಕಂ" },
];

const AGE_GROUPS = [
  { value: "under_18" as AgeGroup, label: "Under 18", sub: "Minor" },
  { value: "18_25" as AgeGroup, label: "18 – 25", sub: "Young adult" },
  { value: "26_35" as AgeGroup, label: "26 – 35", sub: "Adult" },
  { value: "36_50" as AgeGroup, label: "36 – 50", sub: "Adult" },
  { value: "51_60" as AgeGroup, label: "51 – 60", sub: "Senior" },
  { value: "60_plus" as AgeGroup, label: "60+", sub: "Senior" },
];

const CATEGORIES: Array<{ value: string; label: string; icon: LucideIcon; desc: string }> = [
  { value: "identity-documents", label: "Identity & Documents", icon: FileText, desc: "Aadhaar, PAN, Passport" },
  { value: "driving-transport", label: "Driving & Transport", icon: Car, desc: "Licence, RC, Vehicle" },
  { value: "certificates", label: "Certificates", icon: FileText, desc: "Income, Caste, Birth" },
  { value: "voting", label: "Voting", icon: Vote, desc: "Voter ID, Registration" },
  { value: "property-land", label: "Property & Land", icon: House, desc: "Khata, EC, RTC Pahani" },
  { value: "tax-finance", label: "Tax & Finance", icon: Landmark, desc: "Property Tax, EPF" },
  { value: "employment-benefits", label: "Employment", icon: BriefcaseBusiness, desc: "EPF, UAN services" },
  { value: "family-marriage", label: "Family & Marriage", icon: HeartHandshake, desc: "Marriage Certificate" },
  { value: "police-verification", label: "Legal & Verification", icon: Scale, desc: "PCC, Clearance" },
  { value: "ration-food", label: "Ration & Food", icon: Wheat, desc: "Ration Card (Ahara)" },
  { value: "education", label: "Education", icon: GraduationCap, desc: "Scholarships, admissions" },
  { value: "pensions", label: "Pensions & Welfare", icon: HandHeart, desc: "Senior and welfare support" },
];

// Services per category for adaptive suggestions
const CATEGORY_SERVICES: Record<string, Array<{ slug: string; label: string; icon: LucideIcon }>> = {
  "identity-documents": [
    { slug: "aadhaar-new-enrollment", label: "New Aadhaar", icon: FileText },
    { slug: "aadhaar-update", label: "Aadhaar Update", icon: FileText },
    { slug: "pan-card-new", label: "New PAN Card", icon: FileText },
    { slug: "passport", label: "Passport (Fresh/Re-issue)", icon: FileText },
  ],
  "driving-transport": [
    { slug: "driving-licence-renewal", label: "Driving Licence Renewal", icon: Car },
    { slug: "learners-licence", label: "Learner's Licence (LL)", icon: Car },
    { slug: "permanent-driving-licence", label: "Permanent DL", icon: Car },
  ],
  "certificates": [
    { slug: "income-certificate", label: "Income Certificate", icon: FileText },
    { slug: "caste-certificate", label: "Caste Certificate", icon: FileText },
    { slug: "birth-certificate", label: "Birth Certificate", icon: FileText },
  ],
  "voting": [
    { slug: "voter-id-new", label: "New Voter ID Card", icon: Vote },
  ],
  "property-land": [
    { slug: "khata-certificate-transfer", label: "BBMP Khata Transfer", icon: House },
    { slug: "encumbrance-certificate", label: "Encumbrance Certificate (EC)", icon: FileText },
    { slug: "rtc-pahani", label: "RTC / Pahani (Bhoomi)", icon: Wheat },
  ],
  "tax-finance": [
    { slug: "property-tax-bbmp", label: "Property Tax (BBMP)", icon: Landmark },
    { slug: "epf-uan-services", label: "EPF / UAN Services", icon: BriefcaseBusiness },
  ],
  "employment-benefits": [
    { slug: "epf-uan-services", label: "EPF / UAN Services", icon: BriefcaseBusiness },
  ],
  "family-marriage": [
    { slug: "marriage-certificate", label: "Marriage Registration", icon: HeartHandshake },
  ],
  "police-verification": [
    { slug: "police-clearance-certificate", label: "Police Clearance (PCC)", icon: Scale },
  ],
  "ration-food": [
    { slug: "ration-card", label: "Ration Card (Ahara)", icon: Wheat },
  ],
};

function useLabels(lang: Language) {
  const L = {
    en: {
      back: "Back",
      skip: "Explore without personalizing",
      continue: "Continue",
      done: "View My Personalized Guide →",
      finish: "Finish Setup",
      q_lang: "Which language feels most comfortable?",
      q_state: "Where are you getting this done?",
      q_location: "Which area best describes where you live?",
      q_age: "What age group are you in?",
      q_cat: "What are you here to get done?",
      q_service: "Which specific service do you need?",
      q_dynamic: "A quick question to customize your steps",
    },
    hi: {
      back: "वापस",
      skip: "व्यक्तिगतकरण के बिना देखें",
      continue: "आगे बढ़ें",
      done: "मेरी व्यक्तिगत मार्गदर्शिका देखें →",
      finish: "समाप्त करें",
      q_lang: "आप किस भाषा में सहज हैं?",
      q_state: "आप कहाँ से काम करवाना चाहते हैं?",
      q_location: "आप किस क्षेत्र में रहते हैं?",
      q_age: "आपकी आयु वर्ग क्या है?",
      q_cat: "आप क्या काम करवाना चाहते हैं?",
      q_service: "आपको कौन सी सेवा चाहिए?",
      q_dynamic: "आपकी प्रक्रिया को अनुकूलित करने के लिए प्रश्न",
    },
    kn: {
      back: "ಹಿಂದೆ",
      skip: "ವೈಯಕ್ತೀಕರಣವಿಲ್ಲದೆ ವೀಕ್ಷಿಸಿ",
      continue: "ಮುಂದುವರಿಯಿರಿ",
      done: "ನನ್ನ ವೈಯಕ್ತಿಕ ಮಾರ್ಗದರ್ಶಿ ನೋಡಿ →",
      finish: "ಪೂರ್ಣಗೊಳಿಸಿ",
      q_lang: "ನಿಮಗೆ ಯಾವ ಭಾಷೆ ಹೆಚ್ಚು ಅನುಕೂಲ?",
      q_state: "ನೀವು ಎಲ್ಲಿ ಕೆಲಸ ಮಾಡಿಸಿಕೊಳ್ಳಬೇಕು?",
      q_location: "ನೀವು ಯಾವ ಪ್ರದೇಶದಲ್ಲಿ ವಾಸಿಸುತ್ತೀರಿ?",
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
  const [selectedLocation, setSelectedLocation] = useState<"urban" | "rural" | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedServiceSlug, setSelectedServiceSlug] = useState<string | null>(null);
  const [serviceAnswers, setServiceAnswers] = useState<Record<string, unknown>>({});

  useEffect(() => {
    setMounted(true);
    if (guestProfile) {
      if (guestProfile.language) setSelectedLang(guestProfile.language);
      if (guestProfile.age_bracket) setSelectedAge(guestProfile.age_bracket);
      if (guestProfile.location_type) setSelectedLocation(guestProfile.location_type);
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
    if (!selectedService) return [];
    const bilingual = (en: string): Record<Language, string> => ({ en, hi: en, kn: en });
    const option = (value: string, en: string) => ({ value, label: bilingual(en) });
    const question = (id: string, type: "select" | "boolean", label: string, options?: ReturnType<typeof option>[]): ServiceQuestion => ({ id, type, label: bilingual(label), options, required: false, eligibility_relevant: false });
    if (selectedService.slug.startsWith("aadhaar-")) return [
      question("aadhaar_goal", "select", "What do you need to do with Aadhaar?", [option("mobile_update", "Update mobile number"), option("address_update", "Change address"), option("pvc_card", "Order PVC card"), option("download_eaadhaar", "Download e-Aadhaar"), option("child_mbu", "Child biometric update")]),
      question("has_registered_mobile", "boolean", "Do you have access to the mobile number already registered with Aadhaar?"),
      question("has_original_supporting_document", "boolean", "Do you have an original supporting document available, if your update needs one?"),
    ];
    if (["income-certificate", "caste-certificate", "ration-card"].includes(selectedService.slug)) return [
      question("district_region", "select", "Which Karnataka region best matches you?", [option("bengaluru_urban", "Bengaluru Urban"), option("bengaluru_rural", "Bengaluru Rural"), option("other_karnataka", "Another Karnataka district"), option("not_sure", "Not sure")]),
      question("locality_administration", "select", "Which local administration best matches your area?", [option("bbmp", "BBMP"), option("urban", "Other town or city"), option("rural", "Village / rural area")]),
      question("ration_card_status", "select", "What is your ration-card status?", [option("bpl", "BPL card"), option("apl", "APL card"), option("no_card", "No ration card"), option("not_sure", "Not sure")]),
      question("scheme_context", "select", "How are you using this guidance?", [option("self", "For myself"), option("household", "For my household"), option("information", "I am only checking information")]),
    ];
    return (selectedService.questions ?? []).slice(0, 2);
  }, [selectedService]);

  // Steps definition
  // 0: language, 1: state, 2: age, 3: category, 4: service (optional), 5..N: service questions (optional)
  const categoryServices = selectedCategory ? (CATEGORY_SERVICES[selectedCategory] ?? []) : [];

  const totalSteps = useMemo(() => {
    let count = 5; // language, state, location, age, category
    if (categoryServices.length > 0) {
      count += 1; // service selection step
      if (selectedServiceSlug && serviceQuestions.length > 0) {
        count += Math.min(serviceQuestions.length, 4); // concise, service-aware questions only
      }
    }
    return count;
  }, [categoryServices.length, selectedServiceSlug, serviceQuestions.length]);

  const goNext = () => {
    setDirection(1);
    // If at category step and no services, finish
    if (stepIdx === 4 && categoryServices.length === 0) {
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
      location_type: selectedLocation,
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
      location_type: selectedLocation,
      category: selectedCategory,
      collected_answers: serviceAnswers,
    });
    setLanguage(selectedLang);
    markOnboarded();
    if (onComplete) {
      onComplete();
      if (selectedServiceSlug) router.push(`/chat?q=${encodeURIComponent(`Guide me on ${selectedService?.name.en ?? "this service"}`)}&service_slug=${selectedServiceSlug}`);
    } else if (selectedServiceSlug) {
      router.push(`/chat?q=${encodeURIComponent(`Guide me on ${selectedService?.name.en ?? "this service"}`)}&service_slug=${selectedServiceSlug}`);
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

  const pickLocation = (location: "urban" | "rural") => {
    setSelectedLocation(location);
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
    const hasTailoredQuestions = slug.startsWith("aadhaar-") || ["income-certificate", "caste-certificate", "ration-card"].includes(slug) || Boolean(svc?.questions?.length);
    if (hasTailoredQuestions) {
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
  let currentStepView: "language" | "state" | "location" | "age" | "category" | "service" | "dynamic_question" = "language";
  let activeQuestion: ServiceQuestion | null = null;

  if (stepIdx === 0) currentStepView = "language";
  else if (stepIdx === 1) currentStepView = "state";
  else if (stepIdx === 2) currentStepView = "location";
  else if (stepIdx === 3) currentStepView = "age";
  else if (stepIdx === 4) currentStepView = "category";
  else if (stepIdx === 5 && categoryServices.length > 0) currentStepView = "service";
  else if (stepIdx >= 6 && serviceQuestions.length > 0) {
    currentStepView = "dynamic_question";
    activeQuestion = serviceQuestions[stepIdx - 6] ?? null;
  }

  const progress = Math.min((stepIdx + 1) / Math.max(totalSteps, 1), 1);

  const variants = {
    enter: (d: number) => ({ opacity: 0, x: d * 28 }),
    center: { opacity: 1, x: 0 },
    exit: (d: number) => ({ opacity: 0, x: -d * 28 }),
  };

  return (
    <div className={`w-full ${isModal ? "max-w-xl mx-auto p-4 sm:p-6" : "min-h-screen bg-[#061f2b] flex flex-col items-center justify-center px-4 py-8"}`}>
      {/* Glow */}
      {!isModal && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[#8ef3eb]/15 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#087477]/45 rounded-full blur-[100px]" />
          <div className="absolute top-[15%] -right-16 h-72 w-72 rounded-full border border-[#8ef3eb]/20 bg-[#7C5CFF]/15 blur-[1px] animate-[spin_18s_linear_infinite]" />
          <div className="absolute inset-0 opacity-[0.09] [background-image:linear-gradient(rgba(142,243,235,.65)_1px,transparent_1px),linear-gradient(90deg,rgba(142,243,235,.65)_1px,transparent_1px)] [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_74%)]" />
        </div>
      )}

      <div className={`relative z-10 w-full ${isModal ? "" : "max-w-5xl mx-auto bg-[#073E45]/80 border border-white/20 backdrop-blur-xl rounded-[2rem] p-5 sm:p-8 shadow-2xl shadow-[#022b32]/50"}`}>
        <div className={!isModal ? "lg:grid lg:grid-cols-[0.78fr_1.22fr] lg:gap-10 lg:items-center" : ""}>
        {!isModal && <aside className="relative hidden min-h-[560px] overflow-hidden rounded-[1.5rem] border border-white/15 bg-[linear-gradient(145deg,rgba(124,92,255,.26),rgba(35,212,193,.13)_55%,rgba(7,62,69,.25))] lg:flex lg:flex-col lg:justify-between p-7">
          <div className="relative z-10"><div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[11px] font-semibold tracking-[.16em] text-[#d9fffa] uppercase"><span className="h-1.5 w-1.5 rounded-full bg-[#8ef3eb] shadow-[0_0_12px_#8ef3eb]" />Personalized route</div><h1 className="mt-5 text-3xl font-black leading-tight tracking-tight text-white">Your next government task, <span className="text-[#8ef3eb]">made clearer.</span></h1><p className="mt-3 text-sm leading-relaxed text-[#c6e0e1]">A few safe choices let NammaPath organise the right official guidance for you.</p></div>
          <OnboardingOrb />
          <div className="relative z-10 flex items-center gap-2 text-xs text-[#d9fffa]"><NammaMark className="h-7 w-7" /><span><strong>NammaPath</strong><br />Karnataka citizen guidance</span></div>
        </aside>}
        <div className="min-w-0">
        {!isModal && (
          <div className="flex items-center gap-3 mb-7">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#39bdb6] to-[#087477] text-white flex items-center justify-center shadow-lg shadow-[#022b32]/40"><ShieldCheck className="w-6 h-6" /></div>
            <div><p className="font-bold text-white tracking-tight">Namma<span className="text-[#8ef3eb]">Path</span> Karnataka</p><p className="text-xs text-[#bff5ef]/80">A clearer path to public services</p></div>
          </div>
        )}
        {!isModal && (
          <p className="mb-5 flex items-start gap-2 text-xs text-cyan-50/80 leading-relaxed">
            <ShieldCheck className="w-4 h-4 shrink-0 text-cyan-200" />
            We provide official guidance. We never collect or store identity numbers, passwords, or OTPs.
          </p>
        )}
        {/* Progress Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-wider text-[#8ef3eb] uppercase">
              Step {stepIdx + 1} of {totalSteps}
            </span>
            <button
              onClick={skip}
              className="text-xs text-gray-400 hover:text-white flex items-center gap-1 transition-colors px-2 py-1 rounded-lg hover:bg-white/5"
            >
              {L.skip}
            </button>
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-[#8ef3eb] via-[#39bdb6] to-[#0B8C92] rounded-full"
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
                        <span className="w-9 h-9 rounded-xl bg-brand-500/15 text-brand-100 border border-brand-300/20 inline-flex items-center justify-center text-xs font-extrabold">{lang.code}</span>
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
                    <Landmark className="w-7 h-7 text-brand-300" />
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

              {/* 3. Location type — helps tailor online/offline guidance */}
              {currentStepView === "location" && (
                <StepShell title={L.q_location} subtitle="This only helps us explain the most relevant route. We do not ask for your address.">
                  <div className="grid grid-cols-2 gap-3">
                    <OptionCard selected={selectedLocation === "urban"} onClick={() => pickLocation("urban")}>
                      <Building2 className="w-6 h-6 text-brand-300" />
                      <div><p className="font-bold text-white text-sm">City / Town</p><p className="text-xs text-gray-400">Urban area</p></div>
                    </OptionCard>
                    <OptionCard selected={selectedLocation === "rural"} onClick={() => pickLocation("rural")}>
                      <MapPin className="w-6 h-6 text-brand-300" />
                      <div><p className="font-bold text-white text-sm">Village / Rural</p><p className="text-xs text-gray-400">Rural area</p></div>
                    </OptionCard>
                  </div>
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
                        <cat.icon className="w-5 h-5 shrink-0 text-brand-300" />
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
                        <svc.icon className="w-5 h-5 text-brand-300" />
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
      </div>
    </div>
  );
}

function OnboardingOrb() {
  return (
    <div className="relative mx-auto grid h-64 w-64 place-items-center" aria-hidden>
      <div className="absolute inset-3 rounded-full border border-[#8ef3eb]/30 bg-[#23d4c1]/10 shadow-[inset_0_0_45px_rgba(142,243,235,.16),0_0_55px_rgba(35,212,193,.22)]" />
      <div className="absolute h-52 w-52 rounded-[42%] border border-white/25 bg-[linear-gradient(145deg,rgba(255,255,255,.23),rgba(124,92,255,.2)_42%,rgba(35,212,193,.28))] shadow-[20px_26px_35px_rgba(0,0,0,.25)] rotate-[-14deg]" />
      <div className="relative grid h-32 w-32 place-items-center rounded-[2rem] border border-white/35 bg-[#073E45]/85 shadow-[0_18px_34px_rgba(1,17,28,.42)]"><NammaMark className="h-20 w-20" /></div>
      <div className="absolute right-0 top-7 rounded-xl border border-white/20 bg-white/15 px-3 py-2 text-[10px] font-bold text-white shadow-xl backdrop-blur-md">VERIFIED PATH</div>
      <div className="absolute bottom-8 left-[-8px] rounded-xl border border-[#8ef3eb]/30 bg-[#073E45]/85 px-3 py-2 text-[10px] font-bold text-[#bff5ef] shadow-xl">SAFE BY DESIGN</div>
    </div>
  );
}

function StepShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-bold text-white mb-5 leading-snug">{title}</h2>
      {subtitle && <p className="text-sm text-gray-400 -mt-3 mb-5 leading-relaxed">{subtitle}</p>}
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
          ? "border-[#39bdb6] bg-[#087477]/35 shadow-[0_0_0_3px_rgba(57,189,182,0.18)]"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
        }`}
    >
      {children}
      {selected && (
        <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-[#0B8C92] flex items-center justify-center shadow-sm">
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
