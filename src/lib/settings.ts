import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "@/lib/cache-tags";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSupabasePublic } from "@/lib/supabase/public";
import type { Json } from "@/lib/supabase/database";

export type SiteSettings = {
  shop_enabled: boolean;
  wa_number: string;
  site_title: string;
  site_description: string;
  shop_closed_message: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  shop_enabled: true,
  wa_number: "62xxxxxxxxxx",
  site_title: "Ngantuqan",
  site_description:
    "Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital.",
  shop_closed_message: "Toko sedang tutup. Cek lagi nanti ya!",
};

function asString(value: Json | undefined, fallback: string): string {
  return typeof value === "string" ? value : fallback;
}

function asBoolean(value: Json | undefined, fallback: boolean): boolean {
  if (typeof value === "boolean") return value;
  if (value === "true") return true;
  if (value === "false") return false;
  return fallback;
}

async function loadSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return DEFAULT_SETTINGS;

  try {
    const supabase = createSupabasePublic();
    const { data, error } = await supabase.from("site_settings").select("key, value");
    if (error || !data) return DEFAULT_SETTINGS;

    const map = new Map(data.map((row) => [row.key, row.value]));
    return {
      shop_enabled: asBoolean(map.get("shop_enabled"), DEFAULT_SETTINGS.shop_enabled),
      wa_number: asString(map.get("wa_number"), DEFAULT_SETTINGS.wa_number),
      site_title: asString(map.get("site_title"), DEFAULT_SETTINGS.site_title),
      site_description: asString(map.get("site_description"), DEFAULT_SETTINGS.site_description),
      shop_closed_message: asString(
        map.get("shop_closed_message"),
        DEFAULT_SETTINGS.shop_closed_message,
      ),
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export const getSettings = unstable_cache(loadSettings, ["site-settings"], {
  tags: [CACHE_TAGS.settings],
});

export async function isShopEnabled(): Promise<boolean> {
  const settings = await getSettings();
  return settings.shop_enabled;
}
