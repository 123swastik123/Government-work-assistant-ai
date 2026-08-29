"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save, ShieldCheck, Eye, AlertTriangle, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";

interface ServiceData {
  id: string;
  slug: string;
  name: Record<string, string>;
  category: string;
  tier: number;
  verification_status: string;
  last_verified_on: string | null;
  official_url: string;
  source_notes: string | null;
  active: boolean;
  version: number;
  updated_at: string;
}

interface Props {
  service: ServiceData;
  adminRole: string;
}

export function AdminServiceEditor({ service, adminRole }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [confirmVerify, setConfirmVerify] = useState(false);

  const [fields, setFields] = useState({
    name_en: service.name?.en ?? "",
    name_hi: service.name?.hi ?? "",
    name_kn: service.name?.kn ?? "",
    official_url: service.official_url ?? "",
    source_notes: service.source_notes ?? "",
    last_verified_on: service.last_verified_on ?? "",
    active: service.active,
  });

  const [changeReason, setChangeReason] = useState("");

  const set = (key: keyof typeof fields, value: string | boolean) =>
    setFields((p) => ({ ...p, [key]: value }));

  const save = async () => {
    if (!changeReason.trim()) {
      toast.error("Please enter a reason for this change.");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: { en: fields.name_en, hi: fields.name_hi, kn: fields.name_kn },
          official_url: fields.official_url,
          source_notes: fields.source_notes,
          active: fields.active,
          change_reason: changeReason,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Service updated successfully");
        router.push("/admin");
      } else {
        toast.error(data.error ?? "Update failed");
      }
    } catch {
      toast.error("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const markVerified = async () => {
    if (!confirmVerify) { setConfirmVerify(true); return; }
    setVerifying(true);
    try {
      const res = await fetch(`/api/admin/services/${service.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          verification_status: "verified",
          last_verified_on: new Date().toISOString().split("T")[0],
          change_reason: "Manual verification confirmed",
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Service marked as verified!");
        router.push("/admin");
      } else {
        toast.error(data.error ?? "Failed");
      }
    } catch {
      toast.error("Failed to verify");
    } finally {
      setVerifying(false); setConfirmVerify(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back */}
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to admin
      </Link>

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{service.name?.en ?? service.slug}</h1>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="default">Tier {service.tier}</Badge>
            <Badge variant={service.verification_status === "verified" ? "verified" : "needs_verification"} showIcon>
              {service.verification_status.replace(/_/g, " ")}
            </Badge>
            <Badge variant={service.active ? "success" : "default"}>
              {service.active ? "Active" : "Inactive"}
            </Badge>
            <span className="text-xs text-gray-400">v{service.version}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href={`/services/${service.slug}`} target="_blank">
            <Button variant="outline" size="sm" leftIcon={<Eye className="w-4 h-4" />}>
              Preview
            </Button>
          </Link>
        </div>
      </div>

      <div className="space-y-5">
        {/* Verification warning */}
        {service.verification_status !== "verified" && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
          >
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-800">This service needs verification</p>
              <p className="text-xs text-amber-700 mt-0.5">
                Verify all fields against official Karnataka government sources before marking as verified.
                Never display unverified information as verified to citizens.
              </p>
            </div>
          </motion.div>
        )}

        {/* Basic info */}
        <Card padding="md">
          <h2 className="font-semibold text-gray-900 mb-4">Service Name (all languages)</h2>
          <div className="space-y-3">
            <Input label="English" value={fields.name_en} onChange={(e) => set("name_en", e.target.value)} placeholder="Service name in English" />
            <Input label="Hindi (हिन्दी)" value={fields.name_hi} onChange={(e) => set("name_hi", e.target.value)} placeholder="Service name in Hindi" />
            <Input label="Kannada (ಕನ್ನಡ)" value={fields.name_kn} onChange={(e) => set("name_kn", e.target.value)} placeholder="Service name in Kannada" />
          </div>
        </Card>

        {/* Official URL */}
        <Card padding="md">
          <h2 className="font-semibold text-gray-900 mb-1">Official Government URL</h2>
          <p className="text-xs text-gray-500 mb-3">
            This URL is shown to citizens. Must be verified against official sources. Never invent URLs.
          </p>
          <Input
            label="Official URL"
            type="url"
            value={fields.official_url}
            onChange={(e) => set("official_url", e.target.value)}
            placeholder="https://..."
            hint="Must be an official government portal URL"
          />
        </Card>

        {/* Verification */}
        <Card padding="md">
          <h2 className="font-semibold text-gray-900 mb-4">Verification</h2>
          <div className="space-y-3">
            <Input
              label="Last verified on"
              type="date"
              value={fields.last_verified_on}
              onChange={(e) => set("last_verified_on", e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Source notes</label>
              <textarea
                value={fields.source_notes}
                onChange={(e) => set("source_notes", e.target.value)}
                rows={3}
                placeholder="Source URL, who verified, when, what was checked…"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
              />
            </div>
          </div>
        </Card>

        {/* Status */}
        <Card padding="md">
          <h2 className="font-semibold text-gray-900 mb-4">Status</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <div className="relative">
              <input
                type="checkbox"
                checked={fields.active}
                onChange={(e) => set("active", e.target.checked)}
                className="sr-only"
              />
              <div className={`w-10 h-6 rounded-full transition-colors ${fields.active ? "bg-brand-500" : "bg-gray-300"}`}>
                <div className={`w-4 h-4 bg-white rounded-full shadow transition-transform mt-1 ${fields.active ? "translate-x-5" : "translate-x-1"}`} />
              </div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {fields.active ? "Active — visible to citizens" : "Inactive — hidden from citizens"}
            </span>
          </label>
        </Card>

        {/* Change reason */}
        <Card padding="md">
          <h2 className="font-semibold text-gray-900 mb-1">Change reason <span className="text-red-500">*</span></h2>
          <p className="text-xs text-gray-500 mb-3">Required for audit log. Describe what you changed and why.</p>
          <textarea
            value={changeReason}
            onChange={(e) => setChangeReason(e.target.value)}
            rows={2}
            placeholder="e.g. Updated official URL to new Sarathi portal — verified on 29 Aug 2026"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
          />
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
          <Button onClick={save} loading={saving} leftIcon={<Save className="w-4 h-4" />} className="flex-1 sm:flex-none">
            Save changes
          </Button>

          {service.verification_status !== "verified" && (
            <Button
              variant={confirmVerify ? "primary" : "outline"}
              onClick={markVerified}
              loading={verifying}
              leftIcon={confirmVerify ? <Check className="w-4 h-4" /> : <ShieldCheck className="w-4 h-4" />}
              className={confirmVerify ? "flex-1 sm:flex-none bg-emerald-500 hover:bg-emerald-600" : "flex-1 sm:flex-none"}
            >
              {confirmVerify ? "Confirm — mark as verified" : "Mark as verified"}
            </Button>
          )}

          {confirmVerify && (
            <button onClick={() => setConfirmVerify(false)} className="text-sm text-gray-500 hover:text-gray-700 text-center">
              Cancel
            </button>
          )}
        </div>

        {confirmVerify && (
          <motion.div
            initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800"
          >
            <strong>Confirm verification:</strong> You are confirming that all information in this service record
            has been checked against official Karnataka government sources. This will be visible to citizens.
          </motion.div>
        )}
      </div>
    </div>
  );
}
