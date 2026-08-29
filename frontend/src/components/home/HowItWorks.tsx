"use client";
import { motion } from "framer-motion";
import { MessageCircle, Cpu, FileCheck, Globe } from "lucide-react";

const STEPS = [
  { n: "01", icon: MessageCircle, title: "Tell us what you need", desc: "Describe your government task in plain language — English, हिन्दी, or ಕನ್ನಡ. No form numbers required.", color: "bg-brand-500", glow: "shadow-brand-500/20" },
  { n: "02", icon: Cpu, title: "We personalize the path", desc: "Our system identifies the right service and asks only what's still needed — skipping anything already answered.", color: "bg-purple-500", glow: "shadow-purple-500/20" },
  { n: "03", icon: FileCheck, title: "See the verified guide", desc: "Eligibility, documents, fee, and steps — all from verified Karnataka government data. Nothing invented.", color: "bg-emerald-500", glow: "shadow-emerald-500/20" },
  { n: "04", icon: Globe, title: "Finish on the official portal", desc: "We send you directly to the real government portal. The government handles the transaction — we never submit on your behalf.", color: "bg-amber-500", glow: "shadow-amber-500/20" },
];

export function HowItWorks() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">How it works</h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm sm:text-base">
            Four steps from your question to the official government destination.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="relative"
            >
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow h-full">
                <div className={`w-11 h-11 ${step.color} rounded-xl flex items-center justify-center mb-4 shadow-lg ${step.glow}`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-gray-300 tracking-widest mb-1">{step.n}</p>
                <h3 className="font-semibold text-gray-900 mb-2 leading-snug">{step.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <div className="hidden lg:flex absolute top-10 -right-3 z-10 items-center">
                  <div className="w-6 h-0.5 bg-gray-200" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
