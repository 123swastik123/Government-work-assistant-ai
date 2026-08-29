import { cn } from "@/lib/utils";
import { ShieldCheck, AlertTriangle, Info } from "lucide-react";
import type { VerificationStatus } from "@/types";

type Variant = "verified" | "needs_verification" | "general" | "default" | "success" | "warning" | "error";

const variantStyles: Record<Variant, string> = {
  verified: "text-emerald-700 bg-emerald-50 border-emerald-200",
  needs_verification: "text-amber-700 bg-amber-50 border-amber-200",
  general: "text-orange-700 bg-orange-50 border-orange-200",
  default: "text-gray-600 bg-gray-50 border-gray-200",
  success: "text-emerald-700 bg-emerald-50 border-emerald-200",
  warning: "text-amber-700 bg-amber-50 border-amber-200",
  error: "text-red-700 bg-red-50 border-red-200",
};

interface BadgeProps {
  variant?: Variant;
  children: React.ReactNode;
  className?: string;
  showIcon?: boolean;
}

export function Badge({ variant = "default", children, className, showIcon }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-medium border px-2.5 py-0.5 rounded-full", variantStyles[variant], className)}>
      {showIcon && variant === "verified" && <ShieldCheck className="w-3 h-3" />}
      {showIcon && variant === "needs_verification" && <AlertTriangle className="w-3 h-3" />}
      {showIcon && variant === "general" && <Info className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function VerificationBadge({ status, lastVerified }: { status: VerificationStatus; lastVerified?: string | null }) {
  const variant: Variant = status === "verified" ? "verified" : "needs_verification";
  const label = status === "verified" ? "Verified" : "Needs verification";
  return (
    <div className="flex flex-col items-start gap-0.5">
      <Badge variant={variant} showIcon>
        🛡️ {label}
      </Badge>
      {status === "verified" && lastVerified && (
        <span className="text-xs text-gray-400">Last verified: {new Date(lastVerified).toLocaleDateString("en-IN")}</span>
      )}
      {status !== "verified" && (
        <span className="text-xs text-amber-600">Check official portal for latest info</span>
      )}
    </div>
  );
}
