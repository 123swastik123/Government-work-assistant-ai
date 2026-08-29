"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Shield, LogOut, Sparkles, Save } from "lucide-react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useApp } from "@/components/providers";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

interface ProfileData {
  language: string; state: string;
  age_bracket: string | null; category: string | null;
  district: string | null; location_type: string | null;
  created_at: string;
}

export function ProfileClient({
  user, profile,
}: {
  user: { email: string; id: string };
  profile: ProfileData | null;
}) {
  const { language, setLanguage, guestProfile } = useApp();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [selectedLang, setSelectedLang] = useState(language);

  const savePreferences = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: selectedLang }),
      });
      if (res.ok) {
        setLanguage(selectedLang as "en" | "hi" | "kn");
        toast.success("Preferences saved");
      } else {
        toast.error("Failed to save");
      }
    } finally {
      setSaving(false);
    }
  };

  const signOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Signed out");
    router.push("/");
    router.refresh();
  };

  const age = profile?.age_bracket ?? guestProfile.age_bracket;
  const category = profile?.category ?? guestProfile.category;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-brand-500 to-brand-700 rounded-2xl flex items-center justify-center shadow-lg shadow-brand-500/20">
            <User className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Your profile</h1>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <div className="space-y-5">
          {/* Preferences */}
          <Card padding="md">
            <h2 className="font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">State</p>
                  <p className="text-xs text-gray-400">Karnataka (pilot)</p>
                </div>
                <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-lg">Karnataka</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-700">Language</p>
                  <p className="text-xs text-gray-400">Guidance language</p>
                </div>
                <select
                  value={selectedLang}
                  onChange={(e) => setSelectedLang(e.target.value as "en" | "hi" | "kn")}
                  className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">हिन्दी</option>
                  <option value="kn">ಕನ್ನಡ</option>
                </select>
              </div>

              {age && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Age group</p>
                  <span className="text-sm text-gray-600 capitalize">{age.replace(/_/g, " ")}</span>
                </div>
              )}

              {category && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Category</p>
                  <span className="text-sm text-gray-600 capitalize">{category.replace(/-/g, " ")}</span>
                </div>
              )}

              {profile?.created_at && (
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-700">Member since</p>
                  <span className="text-sm text-gray-400">
                    {new Date(profile.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-5 pt-5 border-t border-gray-100">
              <Button onClick={savePreferences} loading={saving} size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save preferences
              </Button>
              <Link href="/onboarding">
                <Button variant="outline" size="sm" leftIcon={<Sparkles className="w-4 h-4" />}>
                  Re-run personalization
                </Button>
              </Link>
            </div>
          </Card>

          {/* Security */}
          <Card padding="md">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-4 h-4 text-emerald-500" />
              <h2 className="font-semibold text-gray-900">Security &amp; Privacy</h2>
            </div>
            <div className="space-y-3 text-sm text-gray-600">
              <p>✓ No Aadhaar or PAN numbers stored</p>
              <p>✓ No government credentials collected</p>
              <p>✓ Email OTP authentication only</p>
              <p>✓ Data encrypted at rest</p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <Link href="/privacy">
                <Button variant="ghost" size="sm">Privacy policy</Button>
              </Link>
            </div>
          </Card>

          {/* Sign out */}
          <Card padding="md" className="border-red-100">
            <h2 className="font-semibold text-gray-700 text-sm mb-3">Account</h2>
            <Button
              onClick={signOut}
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
            >
              Sign out
            </Button>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
