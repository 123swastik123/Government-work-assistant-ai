import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { DashboardClient } from "@/components/dashboard/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard — Government Work Helper" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/dashboard");

  const [journeysRes, bookmarksRes, historyRes] = await Promise.all([
    supabase
      .from("user_service_journeys")
      .select("id, current_step, status, service:services(id,slug,name,category,tier,verification_status)")
      .eq("user_id", user.id)
      .in("status", ["started", "in_progress"])
      .order("updated_at", { ascending: false })
      .limit(5),

    supabase
      .from("bookmarks")
      .select("id, created_at, service:services(id,slug,name,category,tier,verification_status)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10),

    supabase
      .from("history")
      .select("id, query, created_at, service:services(id,slug,name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(8),
  ]);

  // Supabase returns joined rows as arrays — normalize to single objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const normalizeService = (row: any) => {
    if (!row) return row;
    return {
      ...row,
      service: Array.isArray(row.service) ? row.service[0] ?? null : row.service,
    };
  };

  return (
    <DashboardClient
      user={{ email: user.email ?? "", id: user.id }}
      journeys={(journeysRes.data ?? []).map(normalizeService)}
      bookmarks={(bookmarksRes.data ?? []).map(normalizeService)}
      history={(historyRes.data ?? []).map(normalizeService)}
    />
  );
}
