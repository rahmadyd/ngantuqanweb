import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { getSupabaseAnonKey, getSupabaseUrl } from "./env";
import type { Database } from "./database";

export async function createSupabaseServer() {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  if (!url || !key) {
    throw new Error("Supabase belum dikonfigurasi.");
  }

  let cookieStore;
  try {
    cookieStore = await cookies();
  } catch {
    cookieStore = undefined;
  }

  try {
    return createServerClient<Database>(url, key, {
      cookies: {
        getAll() {
          return cookieStore?.getAll() ?? [];
        },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore?.set(name, value, {
              ...options,
              httpOnly: true,
              secure: true,
              sameSite: "lax",
            });
          });
        } catch {
          // ignore
        }
      },
      },
    });
  } catch {
    throw new Error("Gagal membuat klien Supabase.");
  }
}