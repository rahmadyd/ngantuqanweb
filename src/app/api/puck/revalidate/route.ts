import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const { slug } = payload;
    
    if (!slug) {
      return NextResponse.json({ error: "slug diperlukan" }, { status: 400 });
    }
    
    revalidateTag(`page:${slug}`);
    
    return NextResponse.json({ revalidated: true, tag: `page:${slug}` });
  } catch (err) {
    console.error("Revalidasi gagal:", err);
    return NextResponse.json({ error: "Gagal revalidasi" }, { status: 500 });
  }
}