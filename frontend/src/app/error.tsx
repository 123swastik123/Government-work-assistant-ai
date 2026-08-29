"use client";
import { useEffect } from "react";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-6">
        <AlertTriangle className="w-8 h-8 text-red-500" />
      </div>
      <h1 className="text-xl font-bold text-gray-900 mb-2">Something went wrong</h1>
      <p className="text-gray-500 text-sm max-w-sm mb-8">
        We encountered an unexpected error. You can try again or go back to the home page.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <RotateCcw className="w-4 h-4" /> Try again
        </button>
        <Link href="/"
          className="inline-flex items-center gap-2 border border-gray-300 hover:border-brand-400 text-gray-700 text-sm font-medium px-5 py-2.5 rounded-xl transition-colors bg-white">
          <Home className="w-4 h-4" /> Go home
        </Link>
      </div>
    </div>
  );
}
