// GET /api/admin/audit — audit log viewer
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { data: adminRecord } = await supabase.from("admin_users").select("role").eq("auth_user_id", user.id).single();
  if (!adminRecord) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);
  const entity_type = searchParams.get("entity_type");

  const db = getAdminClient();
  let query = db
    .from("audit_logs")
    .select("id, actor_id, action, entity_type, entity_id, metadata, created_at")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (entity_type) query = query.eq("entity_type", entity_type);

  const { data, error } = await query;
  if (error) return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}
