import "server-only";
import { createClient } from "@supabase/supabase-js";
import { getSupabaseUrl } from "./env";
import type { Database } from "./database";

/**
 * Client service role. Hanya dipakai di server (route handler / server action)
 * setelah sesi admin diverifikasi. Jangan impor dari Client Component.
 */
export function createSupabaseAdmin() {
  const url = getSupabaseUrl();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Service role Supabase belum dikonfigurasi.");
  }

  return createClient<Database>(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
