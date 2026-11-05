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

  try {
    const code = url.searchParams.get("code");
    const next = safeNext(url.searchParams.get("next"));

    if (!isSupabaseConfigured()) {
      return NextResponse.redirect(new URL("/studio/login?reason=unconfigured", url.origin));
    }

    let supabase;
    try {
      supabase = await createSupabaseServer();
    } catch {
      return NextResponse.redirect(new URL("/studio/login?reason=server_error", url.origin));
    }

    if (code) {
      try {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          return NextResponse.redirect(new URL("/studio/login?reason=forbidden", url.origin));
        }
      } catch {
        return NextResponse.redirect(new URL("/studio/login?reason=exchange_failed", url.origin));
      }
    }

    let email: string | undefined;
    try {
      const { data } = await supabase.auth.getClaims();
      email =
        typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : undefined;
    } catch {
      email = undefined;
    }

    if (!isAllowlistedEmail(email)) {
      try {
        await supabase.auth.signOut();
      } catch {
        // signOut may fail if cookies cannot be cleared; ignore.
      }
      return NextResponse.redirect(new URL("/studio/login?reason=forbidden", url.origin));
    }

    return NextResponse.redirect(new URL(next, url.origin));
  } catch {
    return NextResponse.redirect(new URL("/studio/login?reason=unexpected_error", url.origin));
  }
}