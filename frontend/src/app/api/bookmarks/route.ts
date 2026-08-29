// GET /api/bookmarks  — list user bookmarks
// POST /api/bookmarks — add bookmark
// DELETE /api/bookmarks?service_id=... — remove bookmark
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const BookmarkSchema = z.object({ service_id: z.string().uuid() });

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("bookmarks")
    .select("id, created_at, service:services(id, slug, name, short_description, category, tier, verification_status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: "Failed to load bookmarks" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = BookmarkSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .upsert({ user_id: user.id, service_id: parsed.data.service_id }, { onConflict: "user_id,service_id" });

  if (error) return NextResponse.json({ success: false, error: "Failed to bookmark" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const serviceId = new URL(req.url).searchParams.get("service_id");
  if (!serviceId) return NextResponse.json({ success: false, error: "service_id required" }, { status: 400 });

  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", user.id)
    .eq("service_id", serviceId);

  if (error) return NextResponse.json({ success: false, error: "Failed to remove bookmark" }, { status: 500 });
  return NextResponse.json({ success: true });
}
