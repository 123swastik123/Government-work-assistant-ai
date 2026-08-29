import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { ProfileClient } from "@/components/dashboard/ProfileClient";

export const metadata: Metadata = { title: "Profile — Government Work Helper" };

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/profile");

  const { data: profile } = await supabase
    .from("profiles")
    .select("language, state, age_bracket, category, district, location_type, created_at")
    .eq("auth_user_id", user.id)
    .single();

  return (
    <ProfileClient
      user={{ email: user.email ?? "", id: user.id }}
      profile={profile ?? null}
    />
  );
}
