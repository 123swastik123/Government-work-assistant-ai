// POST /api/pdf — generate a pre-filled PDF for a service
// The PDF is for citizen convenience only.
// Government Work Helper never submits it anywhere.
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PDFRequestSchema } from "@/lib/validation/schemas";
import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { getSeededServiceBySlug } from "@/lib/services/seed-data";
import type { Language, Service } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type SvcPdfData = Pick<Service, "id" | "name" | "slug" | "official_url" | "steps" | "questions" | "last_verified_on" | "verification_status">;

function sanitizeForWinAnsi(text: string): string {
  if (!text) return "";
  return text
    .replace(/[—–]/g, "-")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[•·]/g, "*")
    .replace(/[₹]/g, "Rs. ")
    .replace(/[^\x00-\x7F]/g, "") // remove characters outside ASCII for standard Helvetica
    .trim();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = PDFRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
    }
    const { service_slug, answers, language } = parsed.data;

    let svc: SvcPdfData | null = null;

    if (isSupabaseConfigured()) try {
      const supabase = await createClient();
      const { data: service, error } = await supabase
        .from("services")
        .select("id, name, slug, official_url, steps, questions, last_verified_on, verification_status")
        .eq("slug", service_slug)
        .eq("active", true)
        .single();

      if (!error && service) {
        svc = service as unknown as SvcPdfData;
      }
    } catch {
      // Fallback
    }

    if (!svc) {
      const seed = getSeededServiceBySlug(service_slug);
      if (seed) svc = seed;
    }

    if (!svc) {
      return NextResponse.json({ success: false, error: "Service not found" }, { status: 404 });
    }

    const lang = (language as Language) ?? "en";

    // ─── Build PDF ────────────────────────────────────────────
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const page = pdfDoc.addPage([595, 842]); // A4
    const { height } = page.getSize();
    let y = height - 50;

    const drawText = (text: string, x: number, yPos: number, size = 10, isBold = false) => {
      const safeText = sanitizeForWinAnsi(text);
      if (!safeText) return;
      page.drawText(safeText, {
        x,
        y: yPos,
        size,
        font: isBold ? boldFont : font,
        color: rgb(0.1, 0.1, 0.1),
        maxWidth: 495,
      });
    };

    // Header
    drawText("GOVERNMENT WORK HELPER", 50, y, 18, true);
    y -= 20;
    drawText("Guidance Summary - For Citizen Reference Only", 50, y, 10);
    y -= 8;
    page.drawLine({ start: { x: 50, y }, end: { x: 545, y }, thickness: 1, color: rgb(0.8, 0.8, 0.8) });
    y -= 20;

    // Disclaimer
    const disclaimer = "IMPORTANT: This document is prepared for your personal convenience only. You must submit your application directly on the official government website. Government Work Helper does not submit applications or accept government payments.";
    page.drawRectangle({ x: 45, y: y - 35, width: 505, height: 48, color: rgb(0.95, 0.97, 1) });
    drawText(disclaimer, 55, y - 10, 8);
    y -= 55;

    // Service name (English guaranteed ASCII safe)
    const serviceName = svc.name.en ?? service_slug;
    drawText(serviceName, 50, y, 15, true);
    y -= 25;

    // Your answers
    drawText("Your Provided Information:", 50, y, 12, true);
    y -= 18;

    const questions = svc.questions ?? [];
    let answersCount = 0;
    for (const q of questions) {
      const qLabel = q.label.en ?? q.id;
      const answer = answers[q.id];
      if (answer !== undefined && answer !== null) {
        drawText(`${qLabel}: ${String(answer)}`, 55, y, 10);
        y -= 15;
        answersCount++;
      }
    }

    if (answersCount === 0) {
      drawText("Standard guidance requested. No specific custom answers recorded.", 55, y, 10);
      y -= 15;
    }

    y -= 10;

    // Official portal link
    drawText("Official Government Portal:", 50, y, 12, true);
    y -= 18;
    drawText(svc.official_url, 55, y, 10);
    y -= 25;

    // Steps summary
    const steps = svc.steps ?? [];
    if (steps.length > 0) {
      drawText("Steps to Complete on Official Portal:", 50, y, 12, true);
      y -= 18;
      for (const step of steps) {
        const stepTitle = step.title.en ?? `Step ${step.step_number}`;
        drawText(`${step.step_number}. ${stepTitle}`, 55, y, 10);
        y -= 14;
        if (y < 90) break; // Prevent bottom margin overflow
      }
    }

    // Footer
    y = 50;
    page.drawLine({ start: { x: 50, y: y + 15 }, end: { x: 545, y: y + 15 }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    drawText("Generated by Government Work Helper - Free Citizen Guidance (Karnataka)", 50, y, 8);
    if (svc.last_verified_on) {
      drawText(`Service data verified: ${svc.last_verified_on}`, 50, y - 12, 8);
    }

    const pdfBytes = await pdfDoc.save();
    const buffer = Buffer.from(pdfBytes);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="gwh-${service_slug}.pdf"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json({ success: false, error: "PDF generation failed" }, { status: 500 });
  }
}
