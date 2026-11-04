import { NextResponse } from "next/server";
import { revalidateTag, revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.from("site_settings").select("*");
    if (error) throw error;
    
    const settings = (data || []).reduce((acc: Record<string, string>, row) => {
      acc[row.key] = String(row.value ?? "");
      return acc;
    }, {});
    
    return NextResponse.json({
      shop_enabled: settings.shop_enabled === "true",
      site_title: settings.site_title || "Ngantuqan",
      wa_number: settings.wa_number || "6281234567890",
      shop_closed_message: settings.shop_closed_message || "Toko sedang tutup. Silakan coba lagi nanti.",
    });
  } catch (err) {
    console.error("Gagal memuat settings:", err);
    return NextResponse.json({ error: "Gagal memuat settings" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = await createSupabaseServer();
    
    const updates = Object.entries(body).map(([key, value]) => ({
      key,
      value: String(value),
      updated_at: new Date().toISOString(),
    }));
    
    for (const update of updates) {
      await supabase.from("site_settings").upsert(update, { onConflict: "key" });
    }
    
    revalidateTag("settings");
    revalidatePath("/", "layout");
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Gagal menyimpan settings:", err);
    return NextResponse.json({ error: "Gagal menyimpan settings" }, { status: 500 });
  }
}