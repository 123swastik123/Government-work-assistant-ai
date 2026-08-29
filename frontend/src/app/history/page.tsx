import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { HistoryClient } from "@/components/dashboard/HistoryClient";

export const metadata: Metadata = { title: "History — Government Work Helper" };

export default async function HistoryPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/history");

  const { data: history } = await supabase
    .from("history")
    .select("id, query, created_at, service:services(id,slug,name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  // Normalise joined records
  const normalised = (history ?? []).map((h) => ({
    ...h,
    service: Array.isArray(h.service) ? (h.service[0] ?? null) : h.service,
  }));

  return <HistoryClient history={normalised} />;
}
