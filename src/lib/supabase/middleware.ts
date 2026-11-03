import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";
import type { Database } from "./database";

const STUDIO_LOGIN = "/studio/login";

function requestWithPathname(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set("x-pathname", request.nextUrl.pathname);
  return { headers };
}

function nextWithPathname(request: NextRequest) {
  return NextResponse.next({ request: requestWithPathname(request) });
}

function applySessionCookies(from: NextResponse, to: NextResponse) {
  from.cookies.getAll().forEach((cookie) => {
    to.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = from.headers.get(header);
    if (value) to.headers.set(header, value);
  }
  return to;
}

function withStudioHeaders(response: NextResponse) {
  response.headers.set("X-Robots-Tag", "noindex, nofollow");
  return response;
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = nextWithPathname(request);

  const isStudio = request.nextUrl.pathname.startsWith("/studio");
  const isStudioLogin = request.nextUrl.pathname === STUDIO_LOGIN;

  if (isStudio) {
    withStudioHeaders(supabaseResponse);
  }

  if (!isSupabaseConfigured()) {
    if (isStudio && !isStudioLogin) {
      const url = request.nextUrl.clone();
      url.pathname = STUDIO_LOGIN;
      url.searchParams.set("reason", "unconfigured");
      return withStudioHeaders(NextResponse.redirect(url));
    }
    return supabaseResponse;
  }

  const supabase = createServerClient<Database>(getSupabaseUrl()!, getSupabaseAnonKey()!, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        supabaseResponse = nextWithPathname(request);
        if (isStudio) withStudioHeaders(supabaseResponse);
        cookiesToSet.forEach(({ name, value, options }) => {
          supabaseResponse.cookies.set(name, value, options);
        });
        Object.entries(headers ?? {}).forEach(([key, value]) => {
          supabaseResponse.headers.set(key, value);
        });
      },
    },
  });

  const { data } = await supabase.auth.getClaims();
  const email =
    typeof data?.claims?.email === "string" ? data.claims.email.toLowerCase() : undefined;
  const isAdmin = isAllowlistedEmail(email);

  if (isStudio && !isStudioLogin) {
    if (!email || !isAdmin) {
      const url = request.nextUrl.clone();
      url.pathname = STUDIO_LOGIN;
      url.searchParams.set("next", request.nextUrl.pathname);
      if (email && !isAdmin) {
        url.searchParams.set("reason", "forbidden");
        await supabase.auth.signOut();
      }
      return withStudioHeaders(applySessionCookies(supabaseResponse, NextResponse.redirect(url)));
    }
  }

  if (isStudioLogin && isAdmin) {
    const url = request.nextUrl.clone();
    url.pathname = "/studio";
    url.search = "";
    return withStudioHeaders(applySessionCookies(supabaseResponse, NextResponse.redirect(url)));
  }

  return supabaseResponse;
}
