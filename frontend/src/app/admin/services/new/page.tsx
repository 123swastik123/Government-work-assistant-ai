import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminServiceEditor } from "@/components/admin/AdminServiceEditor";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add New Service — Admin" };

export default async function NewAdminServicePage() {
  let adminRole = "admin";
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/auth/login?redirectTo=/admin/services/new");

    const { data: adminRecord } = await supabase
      .from("admin_users")
      .select("role")
      .eq("auth_user_id", user.id)
      .single();
    if (!adminRecord) redirect("/");
    adminRole = adminRecord.role;
  } catch {
    // If supabase offline, allow in dev/local
  }

  const newService = {
    id: "new",
    slug: "",
    name: { en: "", hi: "", kn: "" },
    category: "identity-documents",
    tier: 1,
    verification_status: "needs_verification",
    last_verified_on: new Date().toISOString().split("T")[0],
    official_url: "",
    source_notes: "",
    active: true,
    version: 1,
    updated_at: new Date().toISOString(),
  };

  return <AdminServiceEditor service={newService} adminRole={adminRole} />;
}
