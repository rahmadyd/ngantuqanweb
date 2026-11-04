"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";
import { revalidateTag } from "next/cache";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

function validateMimeType(buffer: Buffer): string | null {
  const signatures: Record<string, number[]> = {
    "image/jpeg": [0xFF, 0xD8, 0xFF],
    "image/png": [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A],
    "image/webp": [0x52, 0x49, 0x46, 0x46],
    "image/gif": [0x47, 0x49, 0x46, 0x38],
  };

  for (const [mime, sig] of Object.entries(signatures)) {
    if (sig.every((byte, i) => buffer[i] === byte)) {
      return mime;
    }
  }
  if (buffer.length >= 12 && 
      buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46 &&
      buffer[8] === 0x57 && buffer[9] === 0x45 && buffer[10] === 0x42 && buffer[11] === 0x50) {
    return "image/webp";
  }
  return null;
}

export async function uploadImage(formData: FormData) {
  const { supabase } = await verifyAdmin();
  
  const file = formData.get("file") as File;
  if (!file) throw new Error("File tidak ditemukan");

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maksimal 5 MB.`);
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const detectedMime = validateMimeType(buffer);
  
  if (!detectedMime || !ALLOWED_MIME_TYPES.includes(detectedMime)) {
    throw new Error(`Tipe file tidak valid: ${detectedMime || "unknown"}. Hanya JPEG, PNG, WebP, GIF.`);
  }

  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 10);
  const ext = detectedMime.split("/")[1];
  const fileName = `${timestamp}-${randomStr}.${ext}`;

  const { data, error } = await supabase.storage
    .from("media")
    .upload(fileName, buffer, {
      contentType: detectedMime,
      upsert: false,
    });

  if (error) throw error;

  const { data: urlData } = supabase.storage
    .from("media")
    .getPublicUrl(fileName);

  revalidateTag("media");
  
  return {
    url: urlData.publicUrl,
    path: fileName,
    mime: detectedMime,
    size: file.size,
  };
}

export async function deleteImage(path: string) {
  const { supabase } = await verifyAdmin();
  
  const { error } = await supabase.storage
    .from("media")
    .remove([path]);
  
  if (error) throw error;
  
  revalidateTag("media");
  return { success: true };
}

export async function listImages() {
  const { supabase } = await verifyAdmin();
  
  const { data, error } = await supabase.storage
    .from("media")
    .list("", { sortBy: { column: "created_at", order: "desc" } });
  
  if (error) throw error;
  
  return data.map(file => ({
    name: file.name,
    url: supabase.storage.from("media").getPublicUrl(file.name).data.publicUrl,
    size: file.metadata?.size,
    mime: file.metadata?.mimetype,
    createdAt: file.created_at,
  }));
}