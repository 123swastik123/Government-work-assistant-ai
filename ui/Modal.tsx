"use client";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./Button";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = { sm: "max-w-sm", md: "max-w-md", lg: "max-w-lg", xl: "max-w-2xl" };

export function Modal({ open, onClose, title, description, children, size = "md", className }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-labelledby={title ? "modal-title" : undefined}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />

      {/* Panel */}
      <div
        ref={dialogRef}
        className={cn(
          "relative w-full bg-white rounded-2xl shadow-2xl animate-scale-in",
          sizes[size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
            <div>
              <h2 id="modal-title" className="text-lg font-semibold text-gray-900">{title}</h2>
              {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
            </div>
            <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close">
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
        {!title && (
          <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close" className="absolute top-4 right-4 z-10">
            <X className="w-4 h-4" />
          </Button>
        )}

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
