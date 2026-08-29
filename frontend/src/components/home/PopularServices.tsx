"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const SERVICES = [
  { slug: "aadhaar-update", name: "Aadhaar Update", category: "Identity", emoji: "🪪", color: "from-blue-500/10 to-blue-600/5 border-blue-200/50 text-blue-700" },
  { slug: "driving-licence-renewal", name: "DL Renewal", category: "Transport", emoji: "🚗", color: "from-emerald-500/10 to-emerald-600/5 border-emerald-200/50 text-emerald-700" },
  { slug: "income-certificate", name: "Income Certificate", category: "Certificates", emoji: "💰", color: "from-purple-500/10 to-purple-600/5 border-purple-200/50 text-purple-700" },
  { slug: "voter-id-new", name: "Voter ID", category: "Voting", emoji: "🗳️", color: "from-orange-500/10 to-orange-600/5 border-orange-200/50 text-orange-700" },
  { slug: "pan-card-new", name: "PAN Card", category: "Identity", emoji: "💳", color: "from-pink-500/10 to-pink-600/5 border-pink-200/50 text-pink-700" },
  { slug: "birth-certificate", name: "Birth Certificate", category: "Certificates", emoji: "👶", color: "from-teal-500/10 to-teal-600/5 border-teal-200/50 text-teal-700" },
  { slug: "ration-card", name: "Ration Card", category: "Food", emoji: "🧺", color: "from-amber-500/10 to-amber-600/5 border-amber-200/50 text-amber-700" },
  { slug: "passport", name: "Passport", category: "Identity", emoji: "✈️", color: "from-indigo-500/10 to-indigo-600/5 border-indigo-200/50 text-indigo-700" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } };

export function PopularServices() {
  return (
    <section className="bg-gray-50 py-16 sm:py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 sm:mb-10">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Popular services</h2>
            <p className="text-gray-500 text-sm mt-1">Most frequently used in Karnataka</p>
          </div>
          <Link href="/services" className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3"
        >
          {SERVICES.map((svc) => (
            <motion.div key={svc.slug} variants={item}>
              <Link href={`/services/${svc.slug}`}
                className={`flex flex-col items-start gap-3 p-4 sm:p-5 rounded-2xl border bg-gradient-to-br ${svc.color} 
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full`}
              >
                <span className="text-2xl sm:text-3xl">{svc.emoji}</span>
                <div className="flex-1">
                  <p className="text-sm sm:text-base font-semibold text-gray-900 group-hover:text-brand-700 transition-colors leading-tight">
                    {svc.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{svc.category}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-brand-500 group-hover:translate-x-0.5 transition-all" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
