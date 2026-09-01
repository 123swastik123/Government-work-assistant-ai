import { ServiceGuidePage } from "@/components/services/ServiceGuidePage";
import { createClient } from "@/lib/supabase/server";
import { getSeededServiceBySlug } from "@/lib/services/seed-data";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Service } from "@/types";
import { isSupabaseConfigured } from "@/lib/supabase/config";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (isSupabaseConfigured()) try {
    const supabase = await createClient();
    const { data } = await supabase.from("services").select("name").eq("slug", slug).single();
    if (data?.name) {
      const name = (data.name as Record<string, string>)?.en ?? slug;
      return { title: `${name} — Government Work Helper` };
    }
  } catch {
    // Fallback
  }
  const seed = getSeededServiceBySlug(slug);
  const name = seed?.name?.en ?? slug;
  return { title: `${name} — Government Work Helper` };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) notFound();

  let serviceData: Service | null = null;

  if (isSupabaseConfigured()) try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("services")
      .select("id,slug,name,category,tier,state,description,short_description,eligibility_rules,questions,required_documents,conditional_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,verification_status,last_verified_on,active")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (!error && data) {
      serviceData = data as Service;
    }
  } catch {
    // Supabase offline/unconfigured
  }

  if (!serviceData) {
    const seed = getSeededServiceBySlug(slug);
    if (seed && seed.active) {
      serviceData = seed;
    }
  }

  if (!serviceData) notFound();

  return <ServiceGuidePage service={serviceData} />;
}
