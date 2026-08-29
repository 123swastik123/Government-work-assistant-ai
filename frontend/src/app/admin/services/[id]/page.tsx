import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { redirect, notFound } from "next/navigation";
import { AdminServiceEditor } from "@/components/admin/AdminServiceEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Service — Admin" };

export default async function AdminServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/admin");

  const { data: adminRecord } = await supabase
    .from("admin_users").select("role").eq("auth_user_id", user.id).single();
  if (!adminRecord) redirect("/");

  const { id } = await params;
  const db = getAdminClient();
  const { data: service } = await db.from("services").select("*").eq("id", id).single();
  if (!service) notFound();

  return (
    <AdminServiceEditor
      service={service}
      adminRole={adminRecord.role}
    />
  );
}
