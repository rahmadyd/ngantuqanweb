"use server";

import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { consumeRateLimit } from "@/lib/rate-limit";
import { getSiteUrl, isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServer } from "@/lib/supabase/server";

export type LoginState = {
  ok?: boolean;
  error?: string;
};

export async function sendMagicLink(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();

  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }

  const limit = await consumeRateLimit("ngantuqan_login_rl", 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return { error: "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Supabase belum dikonfigurasi. Isi env dulu." };
  }

  if (!isAllowlistedEmail(email)) {
    return { ok: true };
  }

  const supabase = await createSupabaseServer();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
      emailRedirectTo: `${getSiteUrl()}/auth/callback?next=/studio`,
    },
  });

  if (error) {
    return { error: "Gagal mengirim tautan. Coba lagi nanti." };
  }

  return { ok: true };
}
