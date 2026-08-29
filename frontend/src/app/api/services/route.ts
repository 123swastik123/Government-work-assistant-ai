// GET /api/services — list services with optional filters
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tier = searchParams.get("tier");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "30"), 50);

    const supabase = await createClient();
    let query = supabase
      .from("services")
      .select("id, slug, name, short_description, category, tier, verification_status, last_verified_on, official_url, active")
      .eq("active", true)
      .neq("verification_status", "inactive")
      .order("tier", { ascending: true })
      .limit(limit);

    if (category) query = query.eq("category", category);
    if (tier) query = query.eq("tier", parseInt(tier));

    const { data, error } = await query;
    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Services list error:", err);
    return NextResponse.json({ success: false, error: "Failed to load services" }, { status: 500 });
  }
}
