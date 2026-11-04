import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { slug, token } = payload;
    
    const secret = process.env.REVALIDATE_SECRET;
    if (!secret || token !== secret) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
    
    if (!slug) {
      return NextResponse.json({ error: "slug diperlukan" }, { status: 400 });
    }
    
    const cookieStore = await cookies();
    cookieStore.set("preview_mode", "true", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
    });
    
    cookieStore.set("preview_slug", slug, {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60,
    });
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Preview enable failed:", err);
    return NextResponse.json({ error: "Gagal mengaktifkan preview" }, { status: 500 });
  }
}