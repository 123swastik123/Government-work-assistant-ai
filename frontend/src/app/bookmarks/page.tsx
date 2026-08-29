import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { BookmarksClient } from "@/components/dashboard/BookmarksClient";

export const metadata: Metadata = { title: "Bookmarks — Government Work Helper" };

export default async function BookmarksPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login?redirectTo=/bookmarks");

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("id, created_at, service:services(id,slug,name,short_description,category,tier,verification_status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <BookmarksClient bookmarks={bookmarks ?? []} />;
}
