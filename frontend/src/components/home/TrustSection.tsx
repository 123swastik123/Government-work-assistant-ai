import { ShieldCheck, Zap, Lock, RefreshCcw, AlertTriangle } from "lucide-react";

const POINTS = [
  { icon: ShieldCheck, title: "Verified information", desc: "Every fact is human-verified against official Karnataka sources before being marked verified.", color: "text-emerald-600 bg-emerald-50" },
  { icon: Zap, title: "Fast, plain language", desc: "No jargon. We explain what you need in your language in under 2 minutes.", color: "text-brand-600 bg-brand-50" },
  { icon: Lock, title: "No credentials collected", desc: "We never ask for Aadhaar numbers, PAN, passwords, or OTPs — ever.", color: "text-purple-600 bg-purple-50" },
  { icon: RefreshCcw, title: "Regularly updated", desc: "Service data is reviewed and updated regularly. Each guide shows the verified date.", color: "text-amber-600 bg-amber-50" },
];

export function TrustSection() {
  return (
    <section className="py-16 sm:py-20 px-4 bg-gray-50">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            <ShieldCheck className="w-3.5 h-3.5" /> Our commitment to you
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            We explain.{" "}
            <span className="text-brand-500">The government system processes.</span>
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm">
            Government Work Helper is an independent citizen guidance platform.
            Not affiliated with any government department.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {POINTS.map((point) => (
            <div key={point.title} className="flex gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${point.color}`}>
                <point.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">{point.title}</h3>
                <p className="text-sm text-gray-500 mt-1 leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800 leading-relaxed">
            <strong>Important:</strong> Government Work Helper does not submit applications, make payments, or act as a government agent.
            You complete the actual transaction on the official government portal.
            This platform is free and always will be.
          </p>
        </div>
      </div>
    </section>
  );
}
