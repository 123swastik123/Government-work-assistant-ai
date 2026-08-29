// Admin Supabase client — service role key, bypasses RLS
// SERVER ONLY — never import in browser or client components
import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyDB = any;

let adminClient: ReturnType<typeof createSupabaseClient<AnyDB>> | null = null;

export function getAdminClient() {
  if (adminClient) return adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "placeholder";
  adminClient = createSupabaseClient<AnyDB>(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return adminClient;
}
