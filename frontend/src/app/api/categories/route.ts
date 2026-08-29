import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSeededCategories } from "@/lib/services/seed-data";

export async function GET() {
  try {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase
        .from("service_categories")
        .select("id, name, slug, icon, translations")
        .eq("active", true)
        .order("sort_order");

      if (!error && data && data.length > 0) {
        return NextResponse.json({ success: true, data });
      }
    } catch {
      // Fallback
    }

    const categories = getSeededCategories();
    return NextResponse.json({ success: true, data: categories });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load categories" }, { status: 500 });
  }
}
