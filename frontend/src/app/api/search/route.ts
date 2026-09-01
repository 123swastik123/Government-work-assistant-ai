import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SearchRequestSchema } from "@/lib/validation/schemas";
import { runKeywordPipeline, normalizeInput } from "@/lib/ai/matching-pipeline";
import { getSeededServices } from "@/lib/services/seed-data";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const parsed = SearchRequestSchema.safeParse({
      q: searchParams.get("q") ?? "",
      language: searchParams.get("language") ?? "en",
      category: searchParams.get("category") ?? undefined,
      limit: searchParams.get("limit") ?? "10",
    });
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid query" }, { status: 400 });
    const { q, language, category, limit } = parsed.data;

    let results: Array<{
      id: string;
      slug: string;
      name: Record<string, string>;
      short_description: Record<string, string>;
      category: string;
      tier: number;
      verification_status: string;
      last_verified_on: string | null;
    }> = [];

    if (isSupabaseConfigured()) try {
      const supabase = await createClient();
      const { data: kwResults } = await supabase.rpc("search_services_by_keyword", { search_query: q, filter_state: "karnataka", result_limit: limit });
      if (kwResults && kwResults.length > 0) results = kwResults;

      if (results.length < 3) {
        const { data: fallback } = await supabase
          .from("services")
          .select("id,slug,name,short_description,category,tier,verification_status,last_verified_on")
          .eq("active", true)
          .neq("verification_status", "inactive")
          .ilike("name->>en", `%${q}%`)
          .limit(limit);
        if (fallback) {
          const existingIds = new Set(results.map((r) => r.id));
          for (const r of fallback) {
            if (!existingIds.has(r.id)) results.push(r as (typeof results)[0]);
          }
        }
      }
    } catch {
      // Supabase offline/unconfigured
    }

    // Seed data search fallback
    if (results.length === 0) {
      const seedServices = getSeededServices();
      const slugToId: Record<string, string> = {};
      seedServices.forEach((s) => { slugToId[s.slug] = s.id; });

      const matchResult = runKeywordPipeline(q, slugToId, language);
      if (matchResult.matched && matchResult.service_id) {
        const matched = seedServices.find((s) => s.id === matchResult.service_id);
        if (matched) results.push(matched);
      }

      // Also add text-match candidates
      const normQ = normalizeInput(q);
      const textMatches = seedServices.filter((s) => {
        if (results.some((r) => r.id === s.id)) return false;
        const nameEn = (s.name?.en ?? "").toLowerCase();
        const nameHi = (s.name?.hi ?? "").toLowerCase();
        const nameKn = (s.name?.kn ?? "").toLowerCase();
        const descEn = (s.short_description?.en ?? "").toLowerCase();
        const kws = s.keywords?.map((k) => k.toLowerCase()) ?? [];

        return (
          nameEn.includes(normQ) ||
          nameHi.includes(normQ) ||
          nameKn.includes(normQ) ||
          descEn.includes(normQ) ||
          kws.some((k) => normQ.includes(k) || k.includes(normQ))
        );
      });

      results.push(...textMatches);
    }

    if (category) results = results.filter((r) => r.category === category);

    return NextResponse.json({ success: true, data: results.slice(0, limit) });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ success: false, error: "Search failed" }, { status: 500 });
  }
}
