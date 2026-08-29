import { ServiceGuidePage } from "@/components/services/ServiceGuidePage";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { Service } from "@/types";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("name").eq("slug", slug).single();
  const name = (data?.name as Record<string, string>)?.en ?? slug;
  return { title: `${name} — Government Work Helper` };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("id,slug,name,category,tier,state,description,short_description,questions,required_documents,conditional_documents,official_fee,steps,official_url,official_url_label,what_happens_after,troubleshooting,verification_status,last_verified_on,active")
    .eq("slug", slug)
    .eq("active", true)
    .single();

  if (error || !data) notFound();

  return <ServiceGuidePage service={data as Service} />;
}
