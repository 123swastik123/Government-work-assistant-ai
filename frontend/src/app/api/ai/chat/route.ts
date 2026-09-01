import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import { ChatRequestSchema } from "@/lib/validation/schemas";
import { generateAIResponse } from "@/lib/ai/provider";
import { evaluateEligibility, getApplicableDocuments } from "@/lib/ai/eligibility-engine";
import { runKeywordPipeline } from "@/lib/ai/matching-pipeline";
import { buildServiceContext } from "@/lib/ai/system-prompt";
import { getSeededServices, getSeededServiceBySlug } from "@/lib/services/seed-data";
import type { Language, Service } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({})) as Record<string, unknown>;
    const parsed = ChatRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const { message, conversation_id, guest_session_id, service_slug, language, guest_profile } = parsed.data;
    const databaseConfigured = isSupabaseConfigured();

    let user = null;
    if (databaseConfigured) try {
      const supabase = await createClient();
      const authRes = await supabase.auth.getUser();
      user = authRes.data.user;
    } catch {
      // Offline/unconfigured
    }

    if (!user && !guest_session_id) {
      return NextResponse.json({ success: false, error: "Auth or guest session required" }, { status: 401 });
    }

    let userProfile: Record<string, unknown> = guest_profile ?? {};
    let resolvedLanguage: Language = language ?? "en";

    if (user && databaseConfigured) {
      try {
        const supabase = await createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("language,state,age_bracket,category,district,location_type")
          .eq("auth_user_id", user.id)
          .single();
        if (profile) {
          userProfile = profile as Record<string, unknown>;
          resolvedLanguage = (profile.language as Language) ?? resolvedLanguage;
        }
      } catch {
        // Fallback
      }
    }

    const admin = databaseConfigured ? getAdminClient() : null;
    let convId = conversation_id ?? crypto.randomUUID();

    if (admin) try {
      if (!conversation_id) {
        const { data: conv } = await admin
          .from("conversations")
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .insert({ user_id: user?.id ?? null, guest_session_id: guest_session_id ?? null, language: resolvedLanguage, state: "karnataka" } as any)
          .select("id")
          .single();
        if (conv) convId = (conv as { id: string }).id;
      }
    } catch {
      // Fallback
    }

    let conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = [];
    if (admin) try {
      const { data: messages } = await admin
        .from("conversation_messages")
        .select("role,content")
        .eq("conversation_id", convId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (messages) {
        conversationHistory = ((messages) as Array<{ role: string; content: string }>)
          .reverse()
          .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));
      }
    } catch {
      // Fallback
    }

    const slugToId: Record<string, string> = {};
    if (admin) try {
      const { data: allServices } = await admin.from("services").select("id,slug").eq("active", true);
      if (allServices && allServices.length > 0) {
        (allServices as Array<{ id: string; slug: string }>).forEach((s) => { slugToId[s.slug] = s.id; });
      }
    } catch {
      // Fallback
    }

    if (Object.keys(slugToId).length === 0) {
      getSeededServices().forEach((s) => { slugToId[s.slug] = s.id; });
    }

    let matchedService: Service | null = null;
    let resolvedSlug = service_slug;
    if (!resolvedSlug) {
      const matchResult = runKeywordPipeline(message, slugToId, resolvedLanguage);
      if (matchResult.matched && matchResult.service_slug) resolvedSlug = matchResult.service_slug;
    }

    let serviceCtx = null;
    if (resolvedSlug) {
      if (admin) try {
        const { data: svc } = await admin.from("services").select("*").eq("slug", resolvedSlug).eq("active", true).single();
        if (svc) matchedService = svc as Service;
      } catch {
        // Fallback
      }

      if (!matchedService) {
        matchedService = getSeededServiceBySlug(resolvedSlug);
      }

      if (matchedService) {
        const collectedAnswers = (userProfile.collected_answers as Record<string, unknown>) ?? {};
        const eligResult = evaluateEligibility(matchedService.eligibility_rules, { ...userProfile, ...collectedAnswers });
        const applicableDocs = getApplicableDocuments(matchedService.required_documents, matchedService.conditional_documents, collectedAnswers);
        serviceCtx = buildServiceContext(matchedService, eligResult, resolvedLanguage);
        serviceCtx.applicable_documents = applicableDocs;

        if (admin) try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await admin.from("conversations").update({ matched_service_id: matchedService.id } as any).eq("id", convId);
        } catch {
          // Ignore
        }
      }
    }

    const clientId = user?.id ?? guest_session_id ?? "anonymous";
    const aiResult = await generateAIResponse({
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

    if (aiResult.rateLimited) {
      return NextResponse.json({ success: false, error: "Too many requests." }, { status: 429 });
    }
    const aiResponse = aiResult.response!;

    if (aiResponse.matched_service_id) {
      const isValid = getSeededServices().some((s) => s.id === aiResponse.matched_service_id);
      if (!isValid) {
        if (admin) try {
          const { data: validSvc } = await admin.from("services").select("id").eq("id", aiResponse.matched_service_id).eq("active", true).single();
          if (!validSvc) aiResponse.matched_service_id = null;
        } catch {
          aiResponse.matched_service_id = null;
        }
      }
    }

    if (admin) try {
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
    } catch {
      // Ignore database persistence errors in guest/offline mode
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
