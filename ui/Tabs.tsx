"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: "underline" | "pill";
}

export function Tabs({ tabs, defaultTab, className, variant = "underline" }: TabsProps) {
  const [active, setActive] = useState(defaultTab ?? tabs[0]?.id);
  const current = tabs.find((t) => t.id === active);

  return (
    <div className={className}>
      <div
        role="tablist"
        className={cn(
          "flex gap-1",
          variant === "underline" ? "border-b border-gray-200" : "bg-gray-100 p-1 rounded-xl"
        )}
      >
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={active === tab.id}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActive(tab.id)}
            className={cn(
              "flex items-center gap-1.5 text-sm font-medium transition-all px-3 py-2",
              variant === "underline"
                ? active === tab.id
                  ? "text-brand-600 border-b-2 border-brand-500 -mb-px"
                  : "text-gray-500 hover:text-gray-700"
                : active === tab.id
                  ? "bg-white text-gray-900 rounded-lg shadow-sm"
                  : "text-gray-500 hover:text-gray-700 rounded-lg"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
      <div
        id={`panel-${active}`}
        role="tabpanel"
        className="mt-4"
      >
        {current?.content}
      </div>
    </div>
  );
}
