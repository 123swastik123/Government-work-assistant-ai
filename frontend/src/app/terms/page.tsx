import type { Metadata } from "next";
export const metadata: Metadata = { title: "Terms of Use — Government Work Helper" };

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Terms of Use</h1>
      <p className="text-sm text-gray-400 mb-8">Last updated: August 2026</p>

      <div className="prose-gwh space-y-6 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What Government Work Helper is</h2>
          <p>
            Government Work Helper is a free, independent citizen guidance platform.
            It explains government processes and helps citizens navigate to the correct
            official government portal. It is not a government service, does not act as
            a government agent, and is not affiliated with any government department.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">What we do not do</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not submit government applications on your behalf</li>
            <li>We do not make government payments</li>
            <li>We do not guarantee eligibility or approval</li>
            <li>We do not provide legal advice</li>
            <li>We do not act as an intermediary or agent</li>
            <li>We do not charge for guidance</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Accuracy of information</h2>
          <p>
            Service information is human-verified against official Karnataka government sources.
            Verified guides show a &quot;last verified&quot; date. Unverified content is clearly marked.
            Government processes, fees, and requirements change. Always verify critical details
            on the official government portal before taking action.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Your responsibility</h2>
          <p>
            You are responsible for verifying information on official government portals
            before submitting applications, making payments, or taking any legal action.
            Government Work Helper guidance is informational only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Acceptable use</h2>
          <p>
            You may use Government Work Helper for personal, non-commercial guidance only.
            You may not use this platform to mislead others, scrape data, or impersonate
            government departments.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">Limitation of liability</h2>
          <p>
            Government Work Helper is provided &quot;as is&quot; without warranties.
            We are not liable for decisions made based on guidance provided here.
            Always use official government channels for binding transactions.
          </p>
        </section>
      </div>
    </div>
  );
}
