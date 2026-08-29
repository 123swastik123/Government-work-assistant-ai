import { HowItWorks } from "@/components/home/HowItWorks";
import { TrustSection } from "@/components/home/TrustSection";
import type { Metadata } from "next";
export const metadata: Metadata = { title: "How it works — Government Work Helper" };
export default function HowItWorksPage() {
  return <div><div className="max-w-4xl mx-auto px-4 pt-12 pb-4"><h1 className="text-3xl font-bold text-gray-900 text-center">How Government Work Helper works</h1></div><HowItWorks /><TrustSection /></div>;
}
