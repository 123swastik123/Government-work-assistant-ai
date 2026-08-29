// GET /api/journeys  — list active journeys
// POST /api/journeys — create or update journey
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const JourneyUpsertSchema = z.object({
  service_id: z.string().min(1),
  current_step: z.number().int().min(0).optional(),
  collected_answers: z.record(z.unknown()).optional(),
  status: z.enum(["started", "in_progress", "completed", "abandoned"]).optional(),
});

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { data, error } = await supabase
      .from("user_service_journeys")
      .select("*, service:services(id, slug, name, category, tier, verification_status)")
      .eq("user_id", user.id)
      .in("status", ["started", "in_progress"])
      .order("updated_at", { ascending: false });

    if (error) return NextResponse.json({ success: false, error: "Failed to load journeys" }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to load journeys" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const parsed = JourneyUpsertSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });

    const { service_id, current_step, collected_answers, status } = parsed.data;

    // Check if active journey exists for this service
    const { data: existing } = await supabase
      .from("user_service_journeys")
      .select("id")
      .eq("user_id", user.id)
      .eq("service_id", service_id)
      .not("status", "in", '("completed","abandoned")')
      .single();

    if (existing) {
      // Update existing
      const { data, error } = await supabase
        .from("user_service_journeys")
        .update({
          ...(current_step !== undefined && { current_step }),
          ...(collected_answers && { collected_answers }),
          ...(status && { status }),
        })
        .eq("id", existing.id)
        .select()
        .single();

      if (error) return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
      return NextResponse.json({ success: true, data });
    }

    // Create new
    const { data, error } = await supabase
      .from("user_service_journeys")
      .insert({
        user_id: user.id,
        service_id,
        current_step: current_step ?? 0,
        collected_answers: collected_answers ?? {},
        status: status ?? "started",
      })
      .select()
      .single();

    if (error) return NextResponse.json({ success: false, error: "Create failed" }, { status: 500 });
    return NextResponse.json({ success: true, data });
  } catch {
    return NextResponse.json({ success: false, error: "Create failed" }, { status: 500 });
  }
}
