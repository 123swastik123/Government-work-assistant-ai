"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { History, Trash2, ChevronRight, Clock, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/providers";
import { t } from "@/lib/utils";
import toast from "react-hot-toast";

interface HistoryItem {
  id: string; query: string; created_at: string;
  service?: { id: string; slug: string; name: Record<string, string> } | null;
}

export function HistoryClient({ history: initial }: { history: HistoryItem[] }) {
  const { language } = useApp();
  const [history, setHistory] = useState(initial);
  const [clearing, setClearing] = useState(false);

  const deleteOne = async (id: string) => {
    await fetch(`/api/history?id=${id}`, { method: "DELETE" });
    setHistory((p) => p.filter((h) => h.id !== id));
    toast.success("Removed");
  };

  const clearAll = async () => {
    setClearing(true);
    await fetch("/api/history", { method: "DELETE" });
    setHistory([]);
    setClearing(false);
    toast.success("History cleared");
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
            <History className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">History</h1>
            <p className="text-sm text-gray-400">{history.length} session{history.length !== 1 ? "s" : ""}</p>
          </div>
        </div>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" onClick={clearAll} loading={clearing}
            className="text-red-500 hover:text-red-600 hover:bg-red-50">
            Clear all
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="text-center py-16">
          <History className="mx-auto mb-3 h-9 w-9 text-brand-500" />
          <h3 className="font-semibold text-gray-700 mb-2">No history yet</h3>
          <p className="text-sm text-gray-400 mb-6">Your guidance sessions will appear here.</p>
          <Link href="/chat">
            <Button variant="outline" leftIcon={<Search className="w-4 h-4" />}>
              Start a session
            </Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          {history.map((h, i) => (
            <motion.div key={h.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              className="flex items-center gap-3 p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 transition-colors group"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-800 truncate">{h.query}</p>
                <div className="flex items-center gap-2 mt-1">
                  {h.service && (
                    <span className="text-xs text-brand-500 truncate max-w-[140px]">
                      {t(h.service.name, language)}
                    </span>
                  )}
                  <span className="text-xs text-gray-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" />
                    {new Date(h.created_at).toLocaleDateString("en-IN", {
                      day: "numeric", month: "short", year: "numeric"
                    })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {h.service && (
                  <Link href={`/services/${h.service.slug}`}>
                    <button className="p-1.5 text-gray-400 hover:text-brand-500 hover:bg-brand-50 rounded-lg transition-colors" aria-label="Open service">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
                <button onClick={() => deleteOne(h.id)}
                  className="p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
