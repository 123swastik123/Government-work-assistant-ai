import type { Metadata } from "next";
export const metadata: Metadata = { title: "About — Government Work Helper" };
export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">About NammaPath</h1>
      <div className="prose-gwh space-y-4 text-gray-600">
        <p>NammaPath is a free, independent citizen guidance platform for India, starting with Karnataka.</p>
        <p>Our mission is simple: help every citizen understand and navigate government processes — regardless of their education, language, or familiarity with government systems.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">What we do</h2>
        <p>We explain. We guide. We personalize. We send you to the official government portal to complete the actual transaction.</p>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">What we don&apos;t do</h2>
        <ul>
          <li>We do not submit applications on your behalf</li>
          <li>We do not make payments</li>
          <li>We do not collect Aadhaar, PAN, passwords, or OTPs</li>
          <li>We are not affiliated with any government department</li>
          <li>We do not charge for guidance</li>
        </ul>
        <h2 className="text-xl font-semibold text-gray-900 mt-6">Trust and verification</h2>
        <p>Every service guide on this platform is human-verified against official government sources before being marked &quot;Verified&quot;. Each guide shows the date it was last verified. If information is not yet verified, we clearly say so.</p>
        <p>When AI provides guidance, it only uses the verified data we provide — it never invents government rules, fees, or URLs from its own knowledge.</p>
      </div>
    </div>
  );
}
