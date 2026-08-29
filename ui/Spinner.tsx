import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-8 h-8" };

export function Spinner({ size = "md", className, label = "Loading…" }: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn("inline-flex items-center justify-center", className)}>
      <svg
        className={cn("animate-spin text-brand-500", sizes[size])}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
      </svg>
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[40vh]">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
      <div className="h-5 bg-gray-100 rounded-lg w-3/4 shimmer" />
      <div className="h-4 bg-gray-100 rounded-lg w-full shimmer" />
      <div className="h-4 bg-gray-100 rounded-lg w-2/3 shimmer" />
      <div className="h-8 bg-gray-100 rounded-xl w-1/3 mt-4 shimmer" />
    </div>
  );
}
