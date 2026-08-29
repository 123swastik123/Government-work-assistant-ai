import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { evaluateEligibility, getApplicableDocuments } from "@/lib/ai/eligibility-engine";
import type { Service } from "@/types";

const RequestSchema = z.object({ service_slug: z.string().max(100), answers: z.record(z.unknown()) });

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });

    const supabase = await createClient();
    const { data: service } = await supabase.from("services").select("id,eligibility_rules,required_documents,conditional_documents,questions").eq("slug", parsed.data.service_slug).eq("active", true).single();
    if (!service) return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });

    const svc = service as Pick<Service, "id" | "eligibility_rules" | "required_documents" | "conditional_documents" | "questions">;
    const eligibilityResult = evaluateEligibility(svc.eligibility_rules, parsed.data.answers);
    const applicableDocuments = getApplicableDocuments(svc.required_documents, svc.conditional_documents, parsed.data.answers);

    return NextResponse.json({ success: true, data: { eligibility_result: eligibilityResult, applicable_documents: applicableDocuments } });
  } catch (err) {
    console.error("Eligibility error:", err);
    return NextResponse.json({ success: false, error: "Eligibility evaluation failed" }, { status: 500 });
  }
}
