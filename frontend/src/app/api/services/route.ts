// GET /api/services — list services with optional filters
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSeededServices } from "@/lib/services/seed-data";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tier = searchParams.get("tier");
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

    try {
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
      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch {
      // Supabase unconfigured or offline — fallback to verified seed data
    }

    // Fallback to verified seed data
    let fallback = getSeededServices().filter((s) => s.active && s.verification_status !== "inactive");
    if (category) fallback = fallback.filter((s) => s.category === category);
    if (tier) fallback = fallback.filter((s) => s.tier === parseInt(tier));

    const publicList = fallback.slice(0, limit).map((s) => ({
      id: s.id,
      slug: s.slug,
      name: s.name,
      short_description: s.short_description,
      category: s.category,
      tier: s.tier,
      verification_status: s.verification_status,
      last_verified_on: s.last_verified_on,
      official_url: s.official_url,
      active: s.active,
    }));

    return NextResponse.json({ success: true, data: publicList });
  } catch (err) {
    console.error("Services list error:", err);
    return NextResponse.json({ success: false, error: "Failed to load services" }, { status: 500 });
  }
}
