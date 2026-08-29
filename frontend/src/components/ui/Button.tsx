"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Variant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variants: Record<Variant, string> = {
  primary:   "bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700 shadow-sm disabled:opacity-50",
  secondary: "bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300 disabled:opacity-50",
  ghost:     "text-gray-600 hover:bg-gray-100 active:bg-gray-200 disabled:opacity-50",
  danger:    "bg-red-500 text-white hover:bg-red-600 active:bg-red-700 shadow-sm disabled:opacity-50",
  outline:   "border border-gray-300 text-gray-700 hover:bg-gray-50 bg-white disabled:opacity-50",
};

const sizes: Record<Size, string> = {
  sm: "text-xs px-3 py-1.5 rounded-lg gap-1.5 h-8",
  md: "text-sm px-4 py-2.5 rounded-xl gap-2 h-10",
  lg: "text-base px-6 py-3 rounded-xl gap-2 h-12",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      loading,
      leftIcon,
      rightIcon,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        "inline-flex items-center justify-center font-medium transition-all duration-150",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed select-none",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading
        ? <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        : leftIcon && <span className="shrink-0">{leftIcon}</span>
      }
      {children && <span className="truncate">{children}</span>}
      {!loading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>
  )
);
Button.displayName = "Button";
