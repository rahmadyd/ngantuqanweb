import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isShopEnabled } from "@/lib/settings";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const supabase = await createSupabaseServer();

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }

  if (data.kind === "shop" && !(await isShopEnabled())) {
    return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(data);
}
