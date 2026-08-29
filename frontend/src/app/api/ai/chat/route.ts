import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { ChatRequestSchema } from "@/lib/validation/schemas";
import { callClaude } from "@/lib/ai/claude-client";
import { evaluateEligibility, getApplicableDocuments } from "@/lib/ai/eligibility-engine";
import { runKeywordPipeline } from "@/lib/ai/matching-pipeline";
import { buildServiceContext } from "@/lib/ai/system-prompt";
import type { Language, Service } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const { message, conversation_id, guest_session_id, service_slug, language } = parsed.data;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user && !guest_session_id) {
      return NextResponse.json({ success: false, error: "Auth or guest session required" }, { status: 401 });
    }

    let userProfile: Record<string, unknown> = {};
    let resolvedLanguage: Language = language ?? "en";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("language,state,age_bracket,category,district,location_type")
        .eq("auth_user_id", user.id)
        .single();
      if (profile) {
        userProfile = profile as Record<string, unknown>;
        resolvedLanguage = (profile.language as Language) ?? resolvedLanguage;
      }
    }

    const admin = getAdminClient();
    let convId = conversation_id;

    if (!convId) {
      const { data: conv } = await admin
        .from("conversations")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({ user_id: user?.id ?? null, guest_session_id: guest_session_id ?? null, language: resolvedLanguage, state: "karnataka" } as any)
        .select("id")
        .single();
      if (!conv) return NextResponse.json({ success: false, error: "Failed to create conversation" }, { status: 500 });
      convId = (conv as { id: string }).id;
    }

    const { data: messages } = await admin
      .from("conversation_messages")
      .select("role,content")
      .eq("conversation_id", convId)
      .order("created_at", { ascending: false })
      .limit(10);

    const conversationHistory = ((messages ?? []) as Array<{ role: string; content: string }>)
      .reverse()
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const { data: allServices } = await admin.from("services").select("id,slug").eq("active", true);
    const slugToId: Record<string, string> = {};
    ((allServices ?? []) as Array<{ id: string; slug: string }>).forEach((s) => { slugToId[s.slug] = s.id; });

    let matchedService: Service | null = null;
    let resolvedSlug = service_slug;
    if (!resolvedSlug) {
      const matchResult = runKeywordPipeline(message, slugToId, resolvedLanguage);
      if (matchResult.matched && matchResult.service_slug) resolvedSlug = matchResult.service_slug;
    }

    let serviceCtx = null;
    if (resolvedSlug) {
      const { data: svc } = await admin.from("services").select("*").eq("slug", resolvedSlug).eq("active", true).single();
      if (svc) {
        matchedService = svc as Service;
        const collectedAnswers = (userProfile.collected_answers as Record<string, unknown>) ?? {};
        const eligResult = evaluateEligibility(matchedService.eligibility_rules, { ...userProfile, ...collectedAnswers });
        const applicableDocs = getApplicableDocuments(matchedService.required_documents, matchedService.conditional_documents, collectedAnswers);
        serviceCtx = buildServiceContext(matchedService, eligResult, resolvedLanguage);
        serviceCtx.applicable_documents = applicableDocs;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await admin.from("conversations").update({ matched_service_id: matchedService.id } as any).eq("id", convId);
      }
    }

    const clientId = user?.id ?? guest_session_id ?? "anonymous";
    const claudeResult = await callClaude({
      payload: {
        userProfile,
        serviceContext: serviceCtx,
        eligibilityResult: serviceCtx?.eligibility_result ?? null,
        conversationHistory,
        citizenMessage: message,
        language: resolvedLanguage,
      },
      clientId,
    });

    if (claudeResult.rateLimited) {
      return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
    }
    const aiResponse = claudeResult.response!;

    if (aiResponse.matched_service_id) {
      const { data: validSvc } = await admin.from("services").select("id").eq("id", aiResponse.matched_service_id).eq("active", true).single();
      if (!validSvc) aiResponse.matched_service_id = null;
    }

    await admin.from("conversation_messages")
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .insert([
        { conversation_id: convId, role: "user", content: message } as any,
        { conversation_id: convId, role: "assistant", content: aiResponse.reply_text, structured_response: aiResponse } as any,
      ]);

    if (user) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await admin.from("history").insert({ user_id: user.id, service_id: matchedService?.id ?? null, query: message.slice(0, 500) } as any);
    }

    if (aiResponse.suggest_for_review) {
      await admin.from("unlisted_requests")
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .insert({
          user_id: user?.id ?? null,
          guest_session_id: guest_session_id ?? null,
          suggested_name: aiResponse.suggest_for_review.suggested_name,
          suggested_category: aiResponse.suggest_for_review.suggested_category,
          original_query: message,
          language: resolvedLanguage,
          state: "karnataka",
        } as any);
    }

    return NextResponse.json({
      success: true,
      data: {
        response: aiResponse,
        conversation_id: convId,
        service: matchedService
          ? { id: matchedService.id, slug: matchedService.slug, name: matchedService.name, verification_status: matchedService.verification_status, last_verified_on: matchedService.last_verified_on, official_url: matchedService.official_url }
          : null,
      },
    });
  } catch (err) {
    console.error("Chat API error:", err);
    return NextResponse.json({ success: false, error: "Unexpected error" }, { status: 500 });
  }
}
