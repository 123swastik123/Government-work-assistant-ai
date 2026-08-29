// POST /api/unlisted — flag an unmatched service request for review
// Open to guests — uses service role key for insert
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { UnlistedRequestSchema } from "@/lib/validation/schemas";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = UnlistedRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid data", details: parsed.error.flatten() }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Use admin client so guests (no RLS context) can also insert
    const admin = getAdminClient();

    // Basic rate limiting — max 5 suggestions per session/user per day
    const identifier = user?.id ?? parsed.data.guest_session_id ?? "unknown";
    const { count } = await admin
      .from("unlisted_requests")
      .select("*", { count: "exact", head: true })
      .or(`user_id.eq.${user?.id ?? "00000000-0000-0000-0000-000000000000"},guest_session_id.eq.${parsed.data.guest_session_id ?? ""}`)
      .gte("created_at", new Date(Date.now() - 86400000).toISOString());

    if ((count ?? 0) >= 5) {
      return NextResponse.json(
        { success: false, error: "You have reached the daily limit for service suggestions." },
        { status: 429 }
      );
    }

    void identifier;

    const { data, error } = await admin
      .from("unlisted_requests")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert({
        user_id: user?.id ?? null,
        guest_session_id: parsed.data.guest_session_id ?? null,
        suggested_name: parsed.data.suggested_name,
        suggested_category: parsed.data.suggested_category,
        original_query: parsed.data.original_query,
        language: parsed.data.language,
        state: "karnataka",
        status: "pending",
      } as any)
      .select("id")
      .single();

    if (error) throw error;
    const result = data as { id: string } | null;
    return NextResponse.json({ success: true, data: { id: result?.id } });
  } catch (err) {
    console.error("Unlisted request error:", err);
    return NextResponse.json({ success: false, error: "Failed to submit request" }, { status: 500 });
  }
}
