import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SearchRequestSchema } from "@/lib/validation/schemas";
import { runKeywordPipeline } from "@/lib/ai/matching-pipeline";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = SearchRequestSchema.safeParse({ q: searchParams.get("q") ?? "", language: searchParams.get("language") ?? "en", category: searchParams.get("category") ?? undefined, limit: searchParams.get("limit") ?? "10" });
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid query" }, { status: 400 });
    const { q, language, category, limit } = parsed.data;

    const supabase = await createClient();
    const { data: kwResults } = await supabase.rpc("search_services_by_keyword", { search_query: q, filter_state: "karnataka", result_limit: limit });
    let results = kwResults ?? [];

    if (results.length < 3) {
      const { data: fallback } = await supabase.from("services").select("id,slug,name,short_description,category,tier,verification_status,last_verified_on").eq("active", true).neq("verification_status", "inactive").ilike("name->>en", `%${q}%`).limit(limit);
      if (fallback) {
        const existingIds = new Set(results.map((r: { id: string }) => r.id));
        for (const r of fallback) { if (!existingIds.has(r.id)) results.push(r); }
      }
    }

    if (category) results = results.filter((r: { category: string }) => r.category === category);

    if (results.length === 0) {
      const { data: allSlugs } = await supabase.from("services").select("id,slug").eq("active", true);
      const slugToId: Record<string, string> = {};
      (allSlugs ?? []).forEach((s: { id: string; slug: string }) => { slugToId[s.slug] = s.id; });
      const matchResult = runKeywordPipeline(q, slugToId, language);
      if (matchResult.matched && matchResult.service_id) {
        const { data: svc } = await supabase.from("services").select("id,slug,name,short_description,category,tier,verification_status,last_verified_on").eq("id", matchResult.service_id).single();
        if (svc) results = [svc];
      }
    }

    return NextResponse.json({ success: true, data: results.slice(0, limit) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
