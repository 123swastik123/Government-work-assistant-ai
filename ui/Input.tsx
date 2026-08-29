"use client";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Search } from "lucide-react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {props.required && <span className="text-red-500 ml-1" aria-hidden>*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              "w-full rounded-xl border bg-white text-gray-900 placeholder-gray-400 text-sm",
              "transition-all duration-150",
              "focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent",
              "disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400",
              error ? "border-red-400 focus:ring-red-400" : "border-gray-300 hover:border-gray-400",
              leftIcon ? "pl-10" : "pl-4",
              rightIcon ? "pr-10" : "pr-4",
              "py-3",
              className
            )}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-600" role="alert">{error}</p>}
        {hint && !error && <p id={`${inputId}-hint`} className="mt-1.5 text-xs text-gray-500">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

interface SearchInputProps extends Omit<InputProps, "leftIcon"> {
  onSearch?: (value: string) => void;
}

export function SearchInput({ onSearch, ...props }: SearchInputProps) {
  return (
    <Input
      leftIcon={<Search className="w-5 h-5" />}
      onKeyDown={(e) => {
        if (e.key === "Enter" && onSearch) {
          onSearch((e.target as HTMLInputElement).value);
        }
        props.onKeyDown?.(e);
      }}
      {...props}
    />
  );
}
