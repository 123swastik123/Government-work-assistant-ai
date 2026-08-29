import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Government Work Helper" };

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/admin");

  const { data: adminRecord } = await supabase.from("admin_users").select("role").eq("auth_user_id", user.id).single();
  if (!adminRecord) redirect("/");

  const db = getAdminClient();
  const [svcRes, unlistedRes] = await Promise.all([
    db.from("services").select("id, slug, name, tier, verification_status, active, updated_at").order("tier").limit(100),
    db.from("unlisted_requests").select("id, suggested_name, suggested_category, original_query, language, status, created_at").eq("status", "pending").order("created_at", { ascending: false }).limit(20),
  ]);

  return (
    <AdminDashboard
      adminRole={adminRecord.role}
      services={svcRes.data ?? []}
      unlistedRequests={unlistedRes.data ?? []}
    />
  );
}
