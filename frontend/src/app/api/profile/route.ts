// GET/PUT /api/profile
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ProfileUpdateSchema } from "@/lib/validation/schemas";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("profiles")
    .select("id, language, state, age_bracket, category, district, location_type, created_at, updated_at")
    .eq("auth_user_id", user.id)
    .single();

  if (error) return NextResponse.json({ success: false, error: "Profile not found" }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = ProfileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("profiles")
    .upsert({ auth_user_id: user.id, ...parsed.data }, { onConflict: "auth_user_id" })
    .select()
    .single();

  if (error) return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
