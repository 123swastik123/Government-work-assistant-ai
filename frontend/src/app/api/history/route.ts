// GET /api/history — user's search/guidance history
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const limit = Math.min(parseInt(new URL(req.url).searchParams.get("limit") ?? "20"), 50);

  const { data, error } = await supabase
    .from("history")
    .select("id, query, created_at, service:services(id, slug, name, category, tier, verification_status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ success: false, error: "Failed to load history" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const historyId = new URL(req.url).searchParams.get("id");
  if (historyId) {
    // Delete specific entry
    await supabase.from("history").delete().eq("user_id", user.id).eq("id", historyId);
  } else {
    // Clear all
    await supabase.from("history").delete().eq("user_id", user.id);
  }

  return NextResponse.json({ success: true });
}
