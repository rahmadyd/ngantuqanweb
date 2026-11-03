import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import type { Database } from "./database";

export function createSupabaseBrowser() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  return createBrowserClient<Database>(url, key);
}
