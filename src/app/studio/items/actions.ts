"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { revalidateTag } from "next/cache";

async function verifyAdmin() {
  const supabase = await createSupabaseServer();
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) {
    throw new Error("Unauthorized: No session");
  }
  
  if (!isAllowlistedEmail(session.user.email)) {
    throw new Error("Forbidden: Not in allowlist");
  }
  
  return { supabase, user: session.user };
}

export async function updateItem(id: string, data: {
  slug: string;
  kind: "project" | "shop";
  title: string;
  summary?: string | null;
  body_md?: string | null;
  cover_image?: string | null;
  images?: string[];
  tags?: string[];
  role?: string | null;
  client?: string | null;
  year?: number | null;
  price_idr?: number | null;
  order_url?: string | null;
  live_url?: string | null;
  repo_url?: string | null;
  is_featured?: boolean;
  is_sold_out?: boolean;
  is_published?: boolean;
  sort_order?: number;
  alt_text?: string | null;
}) {
  const { supabase } = await verifyAdmin();
  
  const updateData = {
    ...data,
    updated_at: new Date().toISOString(),
  };
  
  const { error } = await supabase
    .from("items")
    .update(updateData)
    .eq("id", id);
  
  if (error) throw error;
  
  revalidateTag("items");
  return { success: true };
}

export async function reorderItems(updates: { id: string; sort_order: number }[]) {
  const { supabase } = await verifyAdmin();
  
  for (const update of updates) {
    const { error } = await supabase
      .from("items")
      .update({ sort_order: update.sort_order, updated_at: new Date().toISOString() })
      .eq("id", update.id);
    if (error) throw error;
  }
  
  revalidateTag("items");
  return { success: true };
}

export async function deleteItem(id: string) {
  const { supabase } = await verifyAdmin();
  
  // Get item data to find associated images
  const { data: item, error: fetchError } = await supabase
    .from("items")
    .select("cover_image, images")
    .eq("id", id)
    .single();
  
  if (fetchError) throw fetchError;
  
  // Delete from storage if images exist
  if (item?.cover_image) {
    const url = new URL(item.cover_image);
    const pathParts = url.pathname.split("/");
    const mediaIndex = pathParts.indexOf("media");
    if (mediaIndex !== -1 && mediaIndex + 1 < pathParts.length) {
      const path = pathParts.slice(mediaIndex + 1).join("/");
      await supabase.storage.from("media").remove([path]);
    }
  }
  
  if (item?.images?.length) {
    for (const img of item.images) {
      const url = new URL(img);
      const pathParts = url.pathname.split("/");
      const mediaIndex = pathParts.indexOf("media");
      if (mediaIndex !== -1 && mediaIndex + 1 < pathParts.length) {
        const path = pathParts.slice(mediaIndex + 1).join("/");
        await supabase.storage.from("media").remove([path]);
      }
    }
  }
  
  // Delete from database
  const { error } = await supabase
    .from("items")
    .delete()
    .eq("id", id);
  
  if (error) throw error;
  
  revalidateTag("items");
  return { success: true };
}