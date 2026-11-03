import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "./allowlist";

export type AdminSession = {
  email: string;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  if (!isSupabaseConfigured()) return null;

  try {
    const supabase = await createSupabaseServer();
    const { data } = await supabase.auth.getClaims();
    const email =
      typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : undefined;

    if (!isAllowlistedEmail(email)) return null;
    return { email: email! };
  } catch {
    return null;
  }
}

export async function assertAdmin(): Promise<AdminSession> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Tidak diizinkan.");
  }
  return session;
}
