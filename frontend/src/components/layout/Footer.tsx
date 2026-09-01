import Link from "next/link";
import { Shield } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-gray-900">CivicPath Karnataka</span>
            </div>
            <p className="text-sm text-gray-500 max-w-sm leading-relaxed">
              An independent citizen guidance platform. We explain government processes. 
              The official government system handles the actual transaction.
            </p>
            <p className="text-xs text-gray-400 mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
              ⚠️ We are not affiliated with any government department. 
              We do not submit applications, make payments, or act as an agent.
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Popular Services</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {["Aadhaar Update", "Driving Licence Renewal", "Income Certificate", "Voter ID", "PAN Card"].map((s) => (
                <li key={s}>
                  <Link href={`/search?q=${encodeURIComponent(s)}`} className="hover:text-brand-600 transition-colors">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="font-semibold text-gray-900 text-sm mb-4">Platform</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              {[
                { href: "/how-it-works", label: "How it works" },
                { href: "/about", label: "About" },
                { href: "/privacy", label: "Privacy policy" },
                { href: "/terms", label: "Terms of use" },
              ].map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-brand-600 transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} CivicPath Karnataka. Free for citizens.
          </p>
          <p className="text-xs text-gray-400">
            Karnataka pilot · More states coming soon
          </p>
        </div>
      </div>
    </footer>
  );
}
