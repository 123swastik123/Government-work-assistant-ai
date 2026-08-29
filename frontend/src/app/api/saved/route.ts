import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const Schema = z.object({ service_id: z.string().uuid() });

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("saved_services")
    .select("id, created_at, service:services(id,slug,name,short_description,category,tier,verification_status)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true, data });
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });

  const { error } = await supabase
    .from("saved_services")
    .upsert({ user_id: user.id, service_id: parsed.data.service_id }, { onConflict: "user_id,service_id" });

  if (error) return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const serviceId = new URL(req.url).searchParams.get("service_id");
  if (!serviceId) return NextResponse.json({ success: false, error: "service_id required" }, { status: 400 });

  const { error } = await supabase
    .from("saved_services")
    .delete()
    .eq("user_id", user.id)
    .eq("service_id", serviceId);

  if (error) return NextResponse.json({ success: false, error: "Failed" }, { status: 500 });
  return NextResponse.json({ success: true });
}
