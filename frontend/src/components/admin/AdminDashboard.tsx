"use client";
import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, AlertTriangle, Clock, Eye, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Tabs } from "@/components/ui/Tabs";
import toast from "react-hot-toast";

interface Service { id: string; slug: string; name: Record<string, string>; tier: number; verification_status: string; active: boolean; updated_at: string }
interface UnlistedRequest { id: string; suggested_name: string; suggested_category: string; original_query: string; language: string; status: string; created_at: string }

interface Props {
  adminRole: string;
  services: Service[];
  unlistedRequests: UnlistedRequest[];
}

export function AdminDashboard({ adminRole, services, unlistedRequests }: Props) {
  const verified = services.filter((s) => s.verification_status === "verified").length;
  const needsVerification = services.filter((s) => s.verification_status === "needs_verification").length;
  const inactive = services.filter((s) => !s.active).length;

  const tabs = [
    {
      id: "services",
      label: `Services (${services.length})`,
      content: <ServicesTable services={services} />,
    },
    {
      id: "unlisted",
      label: `Pending requests (${unlistedRequests.length})`,
      content: <UnlistedTable requests={unlistedRequests} />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-sm text-gray-400 mt-1">Role: <Badge variant="default">{adminRole}</Badge></p>
        </div>
        <Link href="/admin/services/new">
          <Button>Add new service</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total services", value: services.length, icon: <Eye className="w-4 h-4" />, color: "text-gray-600" },
          { label: "Verified", value: verified, icon: <CheckCircle2 className="w-4 h-4" />, color: "text-emerald-600" },
          { label: "Needs verification", value: needsVerification, icon: <AlertTriangle className="w-4 h-4" />, color: "text-amber-600" },
          { label: "Inactive", value: inactive, icon: <Clock className="w-4 h-4" />, color: "text-gray-400" },
        ].map((stat) => (
          <Card key={stat.label} padding="md">
            <div className={`flex items-center gap-2 mb-1 ${stat.color}`}>
              {stat.icon}
              <span className="text-xs font-medium">{stat.label}</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </Card>
        ))}
      </div>

      <Tabs tabs={tabs} />
    </div>
  );
}

function ServicesTable({ services }: { services: Service[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            {["Service", "Tier", "Status", "Active", "Updated", ""].map((h) => (
              <th key={h} className="text-left text-xs font-medium text-gray-400 pb-3 pr-4">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {services.map((svc) => (
            <tr key={svc.id} className="hover:bg-gray-50">
              <td className="py-3 pr-4 font-medium text-gray-800">{svc.name?.en ?? svc.slug}</td>
              <td className="py-3 pr-4"><Badge variant="default">T{svc.tier}</Badge></td>
              <td className="py-3 pr-4">
                <Badge variant={svc.verification_status === "verified" ? "verified" : "needs_verification"} showIcon>
                  {svc.verification_status.replace(/_/g, " ")}
                </Badge>
              </td>
              <td className="py-3 pr-4">
                <span className={`text-xs font-medium ${svc.active ? "text-emerald-600" : "text-gray-400"}`}>
                  {svc.active ? "Active" : "Inactive"}
                </span>
              </td>
              <td className="py-3 pr-4 text-gray-400 text-xs">{new Date(svc.updated_at).toLocaleDateString("en-IN")}</td>
              <td className="py-3">
                <div className="flex gap-2">
                  <Link href={`/services/${svc.slug}`} target="_blank">
                    <Button size="sm" variant="ghost" aria-label="Preview"><ExternalLink className="w-3.5 h-3.5" /></Button>
                  </Link>
                  <Link href={`/admin/services/${svc.id}`}>
                    <Button size="sm" variant="outline">Edit</Button>
                  </Link>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function UnlistedTable({ requests }: { requests: UnlistedRequest[] }) {
  const [local, setLocal] = useState(requests);

  const review = async (id: string, status: "accepted" | "rejected") => {
    const res = await fetch("/api/admin/unlisted", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (res.ok) {
      setLocal((p) => p.filter((r) => r.id !== id));
      toast.success(`Request ${status}`);
    } else {
      toast.error("Update failed");
    }
  };

  if (local.length === 0) {
    return <p className="text-sm text-gray-400 text-center py-8">No pending requests.</p>;
  }

  return (
    <div className="space-y-3">
      {local.map((req) => (
        <Card key={req.id} padding="md">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900">{req.suggested_name}</p>
              <p className="text-xs text-gray-400 mt-0.5">Category: {req.suggested_category} · Lang: {req.language}</p>
              <p className="text-sm text-gray-600 mt-2 italic">"{req.original_query}"</p>
              <p className="text-xs text-gray-400 mt-1">{new Date(req.created_at).toLocaleDateString("en-IN")}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => review(req.id, "rejected")}>Reject</Button>
              <Button size="sm" onClick={() => review(req.id, "accepted")}>Accept</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
