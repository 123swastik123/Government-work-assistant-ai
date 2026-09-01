"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShieldCheck, LockKeyhole, Zap, BadgeCheck, Car, FileText, Vote, CreditCard, Baby, Plane, Wheat, Landmark, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { NammaMark } from "@/components/brand/NammaMark";

const CHIPS: Array<{ label: string; icon: LucideIcon }> = [
  { label: "Driving Licence Renewal", icon: Car }, { label: "Aadhaar Update", icon: FileText },
  { label: "Income Certificate", icon: FileText }, { label: "Voter ID", icon: Vote },
  { label: "PAN Card", icon: CreditCard }, { label: "Birth Certificate", icon: Baby },
  { label: "Passport", icon: Plane }, { label: "Ration Card", icon: Wheat },
];

const PLACEHOLDERS = [
  "I want to renew my driving licence…",
  "Mera Aadhaar address change karna hai…",
  "ನನಗೆ income certificate ಬೇಕು…",
  "How do I get a caste certificate?",
];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [phIdx] = useState(0);

  const go = () => { if (query.trim()) router.push(`/chat?q=${encodeURIComponent(query.trim())}`); };

  return (
    <section className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center overflow-hidden bg-[#073E45] px-4 pt-12 pb-20">

      {/* ── Animated gradient background ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-[#0B8C92]/30 rounded-full blur-[120px]" />
        <div className="absolute top-32 -right-32 w-72 h-72 bg-[#39bdb6]/15 rounded-full blur-[80px]" />
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-[#087477]/35 rounded-full blur-[90px]" />
      </div>

      {/* ── SVG grid pattern ── */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04]" aria-hidden>
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>

      {/* ── Floating document SVGs ── */}
      <FloatingDoc className="absolute top-24 left-[8%] opacity-30 hidden lg:block" rotation={-12} duration={4} color="#39bdb6" label="ID" />
      <FloatingDoc className="absolute top-40 right-[10%] opacity-25 hidden lg:block" rotation={10} duration={5} color="#58c6ff" label="RC" />
      <FloatingDoc className="absolute bottom-32 left-[15%] opacity-20 hidden xl:block" rotation={6} duration={6} color="#f0a44b" label="PAN" />
      <FloatingDoc className="absolute bottom-20 right-[8%] opacity-20 hidden xl:block" rotation={-8} duration={5.5} color="#45c68a" label="DL" />

      {/* ── Content ── */}
      <div className="relative z-10 w-full max-w-6xl mx-auto grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="text-center lg:text-left">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-[#bff5ef] text-xs font-semibold px-4 py-1.5 rounded-full mb-8 uppercase tracking-widest">
          <Sparkles className="w-3 h-3" />
          <NammaMark className="h-4 w-4" /> NammaPath Karnataka · Free for citizens
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.05 }}
          className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] tracking-tight">
          Government work,
          <br />
          <span className="bg-gradient-to-r from-brand-300 via-cyan-300 to-brand-400 bg-clip-text text-transparent">
            made simple.
          </span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.1 }}
          className="mt-5 text-lg sm:text-xl text-[#c5d9db] max-w-xl mx-auto lg:mx-0 leading-relaxed">
          Tell us what you need in plain language.
          We figure out the path. You finish on the official portal.
        </motion.p>

        {/* Search box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.15 }}
          className="mt-10 max-w-2xl mx-auto lg:mx-0">
          <div className="relative flex items-end gap-0 bg-white/[0.09] border border-white/20 hover:border-[#39bdb6]/70 focus-within:border-[#39bdb6] focus-within:ring-4 focus-within:ring-[#39bdb6]/15 rounded-2xl transition-all duration-300 p-1.5 shadow-2xl shadow-[#022b32]/25">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); go(); } }}
              placeholder={PLACEHOLDERS[phIdx]}
              rows={2}
              className="flex-1 resize-none bg-transparent px-4 py-3 text-white placeholder-gray-500 text-base focus:outline-none"
              aria-label="What government work do you need help with?"
            />
            <button
              onClick={go}
              disabled={!query.trim()}
              className="shrink-0 flex items-center gap-2 bg-[#0B8C92] hover:bg-[#15a6aa] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-5 py-3 rounded-xl transition-all duration-200 shadow-lg shadow-[#022b32]/25"
            >
              Get help <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-[#a8c5c8] mt-2.5 text-center lg:text-left">Ask in English · हिन्दी · ಕನ್ನಡ</p>
        </motion.div>

        {/* Service chips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.25 }}
          className="mt-8 flex flex-wrap justify-center lg:justify-start gap-2">
          {CHIPS.map((chip) => (
            <button key={chip.label} onClick={() => router.push(`/chat?q=${encodeURIComponent(chip.label)}`)}
              className="flex items-center gap-1.5 text-sm text-[#d6e8e9] bg-white/[0.07] border border-white/15 hover:border-[#39bdb6]/60 hover:bg-[#087477]/40 hover:text-white px-3.5 py-1.5 rounded-full transition-all duration-200">
              <chip.icon className="w-3.5 h-3.5" /> {chip.label}
            </button>
          ))}
        </motion.div>

        {/* Trust bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-[#b2c8ca]">
          {[
            { icon: ShieldCheck, text: "Verified information" }, { icon: LockKeyhole, text: "No credentials collected" },
            { icon: Zap, text: "Clear next steps" }, { icon: BadgeCheck, text: "Free for citizens" },
          ].map((t) => (
            <div key={t.text} className="flex items-center gap-1.5">
              <t.icon className="w-3.5 h-3.5 text-brand-300" /> {t.text}
            </div>
          ))}
        </motion.div>

        {/* Personalize CTA */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6">
          <Link href="/onboarding"
            className="inline-flex items-center gap-2 text-sm text-[#d2fbf6] hover:text-white border border-[#39bdb6]/40 hover:border-[#39bdb6]/70 px-5 py-2 rounded-full transition-all">
            <Sparkles className="w-3.5 h-3.5" />
            Personalize your experience for better results
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
        </div>

        <motion.aside initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.18 }} className="hidden lg:block rounded-[2rem] border border-white/20 bg-white/[0.09] p-6 text-left shadow-2xl shadow-[#022b32]/35 backdrop-blur-xl">
          <div className="flex items-center justify-between"><div className="flex items-center gap-3"><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#39bdb6]/20 text-[#bff5ef]"><Landmark className="h-5 w-5" /></div><div><p className="font-semibold text-white">Your guidance, organized</p><p className="text-xs text-[#b2c8ca]">Verified sources clearly labelled</p></div></div><BadgeCheck className="h-5 w-5 text-[#6ee7b7]" /></div>
          <div className="mt-7 space-y-3">
            {["Choose the service you need", "Answer only safe, relevant questions", "Get clear next steps and an official link"].map((item, index) => <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#022b32]/25 px-4 py-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#0B8C92] text-xs font-bold text-white">{index + 1}</span><span className="text-sm text-[#e3f0f1]">{item}</span></div>)}
          </div>
          <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#6ee7b7]/20 bg-[#6ee7b7]/10 px-3 py-2.5 text-xs text-[#d6fff1]"><ShieldCheck className="h-4 w-4 shrink-0" />We never request identity numbers, passwords, or OTPs.</div>
        </motion.aside>
      </div>

      {/* ── Bottom wave ── */}
      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" aria-hidden>
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60 L0 30 Q360 0 720 30 Q1080 60 1440 30 L1440 60 Z" fill="#EFFCFB"/>
        </svg>
      </div>
    </section>
  );
}

function FloatingDoc({ className, rotation, duration, color, label }: { className: string; rotation: number; duration: number; color: string; label: string }) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -10, 0], rotate: [rotation - 1, rotation + 1, rotation - 1] }}
      transition={{ duration, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg width="64" height="80" viewBox="0 0 64 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="64" height="80" rx="8" fill={color} fillOpacity="0.15"/>
        <rect x="4" y="4" width="56" height="72" rx="6" fill={color} fillOpacity="0.08" stroke={color} strokeOpacity="0.3" strokeWidth="1"/>
        <rect x="12" y="20" width="30" height="3" rx="1.5" fill={color} fillOpacity="0.6"/>
        <rect x="12" y="28" width="24" height="2.5" rx="1.25" fill={color} fillOpacity="0.4"/>
        <rect x="12" y="34" width="28" height="2.5" rx="1.25" fill={color} fillOpacity="0.4"/>
        <rect x="12" y="40" width="20" height="2.5" rx="1.25" fill={color} fillOpacity="0.3"/>
        <rect x="12" y="52" width="14" height="10" rx="3" fill={color} fillOpacity="0.5"/>
        <text x="32" y="61" textAnchor="middle" fontSize="5" fill={color} fontWeight="700" fillOpacity="0.9">{label}</text>
      </svg>
    </motion.div>
  );
}
