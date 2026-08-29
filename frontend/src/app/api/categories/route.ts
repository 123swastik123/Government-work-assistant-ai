import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("service_categories")
      .select("id, name, slug, icon, translations")
      .eq("active", true)
      .order("sort_order");

    if (error) throw error;
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load categories" }, { status: 500 });
  }
}
