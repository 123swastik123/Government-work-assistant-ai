// GET/PUT/DELETE /api/admin/services/[id]
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { AdminServiceUpdateSchema } from "@/lib/validation/schemas";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("role").eq("auth_user_id", user.id).single();
  if (!data) return null;
  return { user, role: data.role };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const db = getAdminClient();
  const { data, error } = await db.from("services").select("*").eq("id", id).single();
  if (error || !data) return NextResponse.json({ success: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ success: true, data });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = AdminServiceUpdateSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });

  const { change_reason, ...updateData } = parsed.data;

  const db = getAdminClient();
  const { data, error } = await db.from("services").update(updateData).eq("id", id).select("id, slug, version").single();
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  // Audit log
  await db.from("audit_logs").insert({
    actor_id: admin.user.id,
    action: "service_updated",
    entity_type: "service",
    entity_id: id,
    metadata: { change_reason: change_reason ?? null, fields_updated: Object.keys(updateData) },
  });

  return NextResponse.json({ success: true, data });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin || admin.role !== "super_admin") {
    return NextResponse.json({ success: false, error: "Super admin required" }, { status: 403 });
  }

  const { id } = await params;
  const db = getAdminClient();

  // Soft delete — set active = false
  const { error } = await db.from("services").update({ active: false, verification_status: "inactive" }).eq("id", id);
  if (error) return NextResponse.json({ success: false, error: error.message }, { status: 500 });

  await db.from("audit_logs").insert({
    actor_id: admin.user.id,
    action: "service_deactivated",
    entity_type: "service",
    entity_id: id,
    metadata: {},
  });

  return NextResponse.json({ success: true });
}
