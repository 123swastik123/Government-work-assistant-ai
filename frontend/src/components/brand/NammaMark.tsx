import { cn } from "@/lib/utils";

/** A small original mark: a path through three layered civic spaces. */
export function NammaMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={cn("shrink-0", className)}>
      <defs>
        <linearGradient id="namma-a" x1="6" y1="5" x2="42" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C5CFF" /><stop offset=".48" stopColor="#23D4C1" /><stop offset="1" stopColor="#0B8C92" />
        </linearGradient>
        <linearGradient id="namma-b" x1="15" y1="10" x2="34" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="white" stopOpacity=".96" /><stop offset="1" stopColor="white" stopOpacity=".5" />
        </linearGradient>
      </defs>
      <path d="M24 3.5 42 14v20L24 44.5 6 34V14L24 3.5Z" fill="url(#namma-a)" />
      <path d="m14 16.8 10-5.9 10 5.9v14.4l-10 5.9-10-5.9V16.8Z" fill="#073E45" fillOpacity=".86" />
      <path d="M16.5 29.8c4.6-7.8 8.3 5 15-13.2" stroke="url(#namma-b)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16.5" cy="29.8" r="2.1" fill="white" /><circle cx="31.5" cy="16.6" r="2.1" fill="white" />
    </svg>
  );
}
