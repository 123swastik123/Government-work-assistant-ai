import Link from "next/link";
import { Shield, ArrowLeft, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-brand-50 rounded-2xl flex items-center justify-center mb-6">
        <Shield className="w-8 h-8 text-brand-500" />
      </div>
      <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-3">Page not found</h2>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        We couldn&apos;t find what you were looking for. Try searching for a government service or go back home.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors">
          <ArrowLeft className="w-4 h-4" /> Go home
        </Link>
        <Link href="/search"
          className="inline-flex items-center gap-2 border border-gray-300 hover:border-brand-400 text-gray-700 hover:text-brand-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors bg-white">
          <Search className="w-4 h-4" /> Search services
        </Link>
      </div>
    </div>
  );
}
