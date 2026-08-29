// GET/PUT /api/admin/unlisted — manage unmatched service requests
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { z } from "zod";

async function requireAdmin(supabase: Awaited<ReturnType<typeof createClient>>) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase.from("admin_users").select("role").eq("auth_user_id", user.id).single();
  return data ? { user, role: data.role } : null;
}

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const status = new URL(req.url).searchParams.get("status") ?? "pending";
  const db = getAdminClient();
  const { data, error } = await db
    .from("unlisted_requests")
    .select("*")
    .eq("status", status)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

const ReviewSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(["under_review", "accepted", "rejected"]),
});

export async function PUT(req: NextRequest) {
  const supabase = await createClient();
  const admin = await requireAdmin(supabase);
  if (!admin) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const parsed = ReviewSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });

  const db = getAdminClient();
  const { error } = await db
    .from("unlisted_requests")
    .update({ status: parsed.data.status, reviewed_at: new Date().toISOString(), reviewed_by: admin.user.id })
    .eq("id", parsed.data.id);

  if (error) return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });

  await db.from("audit_logs")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert({
      actor_id: admin.user.id,
      action: "unlisted_request_reviewed",
      entity_type: "unlisted_request",
      entity_id: parsed.data.id,
      metadata: { new_status: parsed.data.status },
    } as any);

  return NextResponse.json({ success: true });
}
