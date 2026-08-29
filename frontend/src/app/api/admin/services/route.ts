// GET  /api/admin/services — list all services (admin)
// POST /api/admin/services — create new service (admin)
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("role").eq("auth_user_id", user.id).single();
  if (!data) return null;
  return { user, role: data.role };
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "50"), 100);

  const db = getAdminClient();
  let query = db.from("services").select("id, slug, name, category, tier, verification_status, last_verified_on, active, version, updated_at").order("tier").limit(limit);
  if (status) query = query.eq("verification_status", status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ success: false, error: "Failed to load services" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  if (!body.slug || !body.name || !body.official_url) {
    return NextResponse.json({ success: false, error: "slug, name, official_url required" }, { status: 400 });
  }

  const db = getAdminClient();
  const { data, error } = await db.from("services").insert({ ...body, verification_status: "draft" }).select("id, slug").single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Audit log
  await db.from("audit_logs").insert({
    actor_id: admin.user.id,
    action: "service_created",
    entity_type: "service",
    entity_id: data.id,
    metadata: { slug: body.slug },
  });

  return NextResponse.json({ success: true, data });
}
