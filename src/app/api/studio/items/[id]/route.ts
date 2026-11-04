import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createSupabaseServer();

  // Verifikasi admin session
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isAllowlistedEmail(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Item tidak ditemukan" }, { status: 404 });
  }

  return NextResponse.json(data);
}