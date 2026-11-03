import { NextResponse } from "next/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

function safeNext(path: string | null) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/studio";
  return path;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = safeNext(url.searchParams.get("next"));

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(new URL("/studio/login?reason=unconfigured", url.origin));
  }

  const supabase = await createSupabaseServer();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/studio/login?reason=forbidden", url.origin));
    }
  }

  const { data } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : undefined;

  if (!isAllowlistedEmail(email)) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL("/studio/login?reason=forbidden", url.origin));
  }

  return NextResponse.redirect(new URL(next, url.origin));
}
