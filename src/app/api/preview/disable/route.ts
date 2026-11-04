import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("preview_mode");
  cookieStore.delete("preview_slug");
  
  return NextResponse.json({ success: true });
}