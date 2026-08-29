// GET /api/services/[slug] — get full service record
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSeededServiceBySlug } from "@/lib/services/seed-data";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json({ success: false, error: "Invalid slug" }, { status: 400 });
    }

    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("active", true)
        .single();

      if (!error && data) {
        // Never expose source_notes or internal admin fields to browser
        const { source_notes: _sn, embedding: _emb, ...publicData } = data as Record<string, unknown>;
        void _sn; void _emb;
        return NextResponse.json({ success: true, data: publicData });
      }
    } catch {
      // Supabase unconfigured or offline — fallback to seed data
    }

    // Fallback to verified seed data
    const seed = getSeededServiceBySlug(slug);
    if (seed && seed.active) {
      const { source_notes: _sn, ...publicSeed } = seed;
      void _sn;
      return NextResponse.json({ success: true, data: publicSeed });
    }

    return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
  } catch (err) {
    console.error("Service detail error:", err);
    return NextResponse.json({ success: false, error: "Failed to load service" }, { status: 500 });
  }
}
