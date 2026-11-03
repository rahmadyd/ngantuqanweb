import { cookies } from "next/headers";

type RateLimitResult = {
  ok: boolean;
  remaining: number;
};

/**
 * Pembatas sederhana berbasis cookie. Cukup untuk login admin satu orang.
 * Form kontak nanti bisa diganti dengan limiter di Cloudflare.
 */
export async function consumeRateLimit(
  name: string,
  limit: number,
  windowMs: number,
): Promise<RateLimitResult> {
  const store = await cookies();
  const now = Date.now();
  const raw = store.get(name)?.value ?? "";
  const [countRaw, startRaw] = raw.split(":");
  let count = Number(countRaw);
  let start = Number(startRaw);

  if (!Number.isFinite(count) || !Number.isFinite(start) || now - start > windowMs) {
    count = 0;
    start = now;
  }

  count += 1;
  store.set(name, `${count}:${start}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.ceil(windowMs / 1000),
  });

  return { ok: count <= limit, remaining: Math.max(0, limit - count) };
}
