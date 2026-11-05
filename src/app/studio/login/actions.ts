"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { consumeRateLimit } from "@/lib/rate-limit";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabaseServer } from "@/lib/supabase/server";

export type LoginState = {
  ok?: boolean;
  error?: string;
};

export async function signInWithPassword(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !email.includes("@")) {
    return { error: "Masukkan alamat email yang valid." };
  }

  if (!password || password.length < 6) {
    return { error: "Kata sandi terlalu pendek." };
  }

  const limit = await consumeRateLimit("ngantuqan_login_rl", 5, 10 * 60 * 1000);
  if (!limit.ok) {
    return { error: "Terlalu banyak percobaan. Tunggu beberapa menit, lalu coba lagi." };
  }

  if (!isSupabaseConfigured()) {
    return { error: "Gagal masuk. Coba lagi nanti." };
  }

  let supabase;
  try {
    supabase = await createSupabaseServer();
  } catch {
    return { error: "Gagal masuk. Coba lagi nanti." };
  }

  let error;
  try {
    const result = await supabase.auth.signInWithPassword({ email, password });
    error = result.error;
  } catch {
    return { error: "Gagal masuk. Coba lagi nanti." };
  }

  if (error) {
    return { error: "Email atau kata sandi salah." };
  }

  const { data } = await supabase.auth.getClaims();
  const sessionEmail =
    typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : undefined;

  if (!sessionEmail || !isAllowlistedEmail(sessionEmail)) {
    try {
      await supabase.auth.signOut();
    } catch {
      // ignore
    }
    return { error: "Email atau kata sandi salah." };
  }

  const headersList = await headers();
  const host = headersList.get("host") ?? "localhost:3000";
  const protocol = host.includes("localhost") ? "http" : "https";
  const siteUrl = `${protocol}://${host}`;

  redirect(`${siteUrl}/studio`);
}