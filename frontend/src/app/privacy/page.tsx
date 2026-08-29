import type { Metadata } from "next";
export const metadata: Metadata = { title: "Privacy Policy — Government Work Helper" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: August 2026</p>

      <div className="prose-gwh space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What we collect</h2>
          <p>Government Work Helper collects only the minimum information needed to provide guidance:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Language preference, state, age bracket, and service category (set during personalization)</li>
            <li>Your chat messages and the AI responses — stored to avoid repeating questions</li>
            <li>Email address if you choose to sign in (optional)</li>
            <li>Anonymized analytics events (service viewed, search performed, etc.)</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What we never collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Aadhaar numbers</li>
            <li>PAN numbers</li>
            <li>Government portal passwords or OTPs</li>
            <li>Bank account or card details</li>
            <li>Biometric data of any kind</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">How we use your data</h2>
          <p>
            Your data is used solely to personalize guidance within Government Work Helper.
            We do not sell, share, or use your data for advertising.
            Anonymized usage patterns help us improve the platform.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Data storage</h2>
          <p>
            Data is stored securely in Supabase (PostgreSQL) with row-level security.
            Guest session data is stored locally in your browser and is not persisted to our servers
            unless you sign in. Uploaded files (if any) are processed temporarily and deleted.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your rights</h2>
          <p>
            You can delete your account and all associated data at any time from your dashboard.
            For any data requests, contact us at privacy@governmentworkhelper.in.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Third-party services</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Supabase — database and authentication</li>
            <li>Google Gemini AI — AI guidance and reasoning (Google's AI privacy policy applies)</li>
            <li>Sentry — error monitoring (sanitized, no PII)</li>
            <li>Vercel — hosting</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
