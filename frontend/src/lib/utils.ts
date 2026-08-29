import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Language, VerificationStatus } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function t(obj: Record<string, string> | undefined | null, lang: Language): string {
  if (!obj) return "";
  return obj[lang] ?? obj["en"] ?? Object.values(obj)[0] ?? "";
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "Not verified";
  try {
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function formatCurrency(amount: number | null, isFixed = false): string {
  if (amount === null) return "Check official portal";
  if (amount === 0) return "Free";
  return `₹${isFixed ? amount.toFixed(0) : amount}`;
}

export function getVerificationLabel(status: VerificationStatus): string {
  switch (status) {
    case "verified": return "Verified";
    case "needs_verification": return "Needs verification";
    case "draft": return "Draft";
    case "inactive": return "Inactive";
  }
}

export function getVerificationColor(status: VerificationStatus): string {
  switch (status) {
    case "verified": return "text-emerald-700 bg-emerald-50 border-emerald-200";
    case "needs_verification": return "text-amber-700 bg-amber-50 border-amber-200";
    case "draft": return "text-gray-600 bg-gray-50 border-gray-200";
    case "inactive": return "text-red-600 bg-red-50 border-red-200";
  }
}

export function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function truncate(str: string, maxLen: number): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen).trimEnd() + "…";
}
