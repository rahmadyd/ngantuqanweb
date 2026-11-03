import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";

const TEST_TAG = "revalidate-test";

export async function POST(request: Request) {
  const secret =
    request.headers.get("x-revalidate-secret") ??
    new URL(request.url).searchParams.get("secret");
  const expected = process.env.REVALIDATE_SECRET;

  if (!expected || secret !== expected) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  revalidateTag(TEST_TAG);

  return Response.json({
    ok: true,
    tag: TEST_TAG,
    revalidatedAt: new Date().toISOString(),
  });
}
