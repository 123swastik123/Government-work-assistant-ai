"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Baby, Car, CreditCard, FileText, Plane, Vote, Wheat, type LucideIcon } from "lucide-react";

const SERVICES: Array<{ slug: string; name: string; category: string; icon: LucideIcon }> = [
  { slug: "aadhaar-update", name: "Aadhaar Update", category: "Identity", icon: FileText }, { slug: "driving-licence-renewal", name: "DL Renewal", category: "Transport", icon: Car },
  { slug: "income-certificate", name: "Income Certificate", category: "Certificates", icon: FileText }, { slug: "voter-id-new", name: "Voter ID", category: "Voting", icon: Vote },
  { slug: "pan-card-new", name: "PAN Card", category: "Identity", icon: CreditCard }, { slug: "birth-certificate", name: "Birth Certificate", category: "Certificates", icon: Baby },
  { slug: "ration-card", name: "Ration Card", category: "Food", icon: Wheat }, { slug: "passport", name: "Passport", category: "Identity", icon: Plane },
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
                className="flex flex-col items-start gap-3 rounded-2xl border border-brand-100 bg-gradient-to-br from-white to-brand-50/70 p-4 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-md group h-full"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><svc.icon className="w-5 h-5" /></span>
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
