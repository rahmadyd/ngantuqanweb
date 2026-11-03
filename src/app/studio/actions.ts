"use server";

import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export async function signOut() {
  if (isSupabaseConfigured()) {
    const supabase = await createSupabaseServer();
    await supabase.auth.signOut();
  }
  redirect("/studio/login");
}

export async function uploadImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  const file = formData.get("file") as File;
  if (!file) return { error: "No file provided" };

  // Validate MIME type - must be an image
  if (!file.type.startsWith("image/")) {
    return { error: "File yang diunggah bukan gambar valid" };
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    return { error: "Ukuran file maksimal 5 MB" };
  }

  // Convert to ArrayBuffer for upload
  const bytes = await file.arrayBuffer();
  const fileName = `item-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.webp`;

  try {
    const supabase = await createSupabaseServer();

    // Upload to Supabase Storage bucket `media`
    const { error } = await supabase.storage
      .from("media")
      .upload(fileName, new Uint8Array(bytes), {
        contentType: "image/webp",
      });

    if (error) {
      return { error: `Gagal unggah: ${error.message}` };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from("media").getPublicUrl(fileName);

    return { url: publicUrl };
  } catch (err) {
     
    return { error: "Terjadi kesalahan saat unggah gambar" };
  }
}