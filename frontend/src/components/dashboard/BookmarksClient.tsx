"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, BookmarkIcon, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/providers";
import { t } from "@/lib/utils";
import toast from "react-hot-toast";

interface ServiceMini {
  id: string; slug: string;
  name: Record<string, string>;
  short_description: Record<string, string>;
  category: string; tier: number; verification_status: string;
}

interface Bookmark { id: string; created_at: string; service?: ServiceMini }

export function BookmarksClient({ bookmarks: initial }: { bookmarks: Bookmark[] }) {
  const { language } = useApp();
  const [bookmarks, setBookmarks] = useState(initial);

  const remove = async (serviceId: string) => {
    await fetch(`/api/bookmarks?service_id=${serviceId}`, { method: "DELETE" });
    setBookmarks((p) => p.filter((b) => b.service?.id !== serviceId));
    toast.success("Bookmark removed");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 bg-brand-100 rounded-xl flex items-center justify-center">
          <BookmarkIcon className="w-5 h-5 text-brand-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bookmarks</h1>
          <p className="text-sm text-gray-400">{bookmarks.length} saved service{bookmarks.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      {bookmarks.length === 0 ? (
        <div className="text-center py-16">
          <BookmarkIcon className="mx-auto mb-3 h-9 w-9 text-brand-500" />
          <h3 className="font-semibold text-gray-700 mb-2">No bookmarks yet</h3>
          <p className="text-sm text-gray-400 mb-6">Save service guides here for quick access.</p>
          <Link href="/services">
            <Button variant="outline">Browse services</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookmarks.map((b, i) => b.service && (
            <motion.div key={b.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card padding="md" className="relative group h-full flex flex-col">
                <button
                  onClick={() => remove(b.service!.id)}
                  className="absolute top-3 right-3 p-1.5 text-gray-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm pr-8 mb-1">
                    {t(b.service.name, language)}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">
                    {t(b.service.short_description, language)}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    <Badge variant="default" className="text-xs capitalize">
                      {b.service.category.replace(/-/g, " ")}
                    </Badge>
                    <Badge
                      variant={b.service.verification_status === "verified" ? "verified" : "needs_verification"}
                      className="text-xs"
                    >
                      {b.service.verification_status === "verified" ? "✓ Verified" : "Needs verification"}
                    </Badge>
                  </div>
                </div>
                <Link href={`/services/${b.service.slug}`}
                  className="flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors">
                  View guide <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
