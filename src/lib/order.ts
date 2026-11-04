import type { ItemRow } from "@/lib/supabase/database";
import type { SiteSettings } from "@/lib/settings";

function isValidHttpsUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

export function getOrderAction(
  item: Pick<ItemRow, "order_url" | "order_label" | "title" | "slug" | "is_sold_out" | "kind">,
  settings: Pick<SiteSettings, "wa_number" | "order_button_label">,
  baseUrl: string
): { href: string; label: string } | null {
  if (item.is_sold_out) return null;

  // 1. order_url ada -> pakai itu
  if (item.order_url && isValidHttpsUrl(item.order_url)) {
    return {
      href: item.order_url,
      label: item.order_label || settings.order_button_label,
    };
  }

  // 2. order_url tidak valid/ada, tapi wa_number ada -> wa.me
  if (settings.wa_number) {
    const message = encodeURIComponent(`Halo, saya tertarik dengan ${item.title} (${baseUrl}/karya/${item.slug})`);
    return {
      href: `https://wa.me/${settings.wa_number}?text=${message}`,
      label: item.order_label || settings.order_button_label,
    };
  }

  // 3. Keduanya kosong
  return null;
}

export function isExternalLink(href: string): boolean {
  return isValidHttpsUrl(href);
}