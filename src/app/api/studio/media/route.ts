import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isAllowlistedEmail } from "@/lib/auth/allowlist";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

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

export async function GET() {
  const supabase = await createSupabaseServer();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAllowlistedEmail(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data, error } = await supabase.storage
    .from("media")
    .list("", { sortBy: { column: "created_at", order: "desc" } });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const files = data.map(file => {
    const { data: urlData } = supabase.storage.from("media").getPublicUrl(file.name);
    return {
      name: file.name,
      url: urlData.publicUrl,
      size: file.metadata?.size,
      mime: file.metadata?.mimetype,
      createdAt: file.created_at,
    };
  });

  return NextResponse.json(files);
}

export async function POST(request: Request) {
  const supabase = await createSupabaseServer();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAllowlistedEmail(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File terlalu besar: ${(file.size / 1024 / 1024).toFixed(2)} MB. Maksimal 5 MB.` }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const detectedMime = validateMimeType(buffer);
    
    if (!detectedMime || !ALLOWED_MIME_TYPES.includes(detectedMime)) {
      return NextResponse.json({ error: `Tipe file tidak valid: ${detectedMime || "unknown"}. Hanya JPEG, PNG, WebP, GIF.` }, { status: 400 });
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

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = supabase.storage.from("media").getPublicUrl(fileName);

    return NextResponse.json({
      url: urlData.publicUrl,
      path: fileName,
      mime: detectedMime,
      size: file.size,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload gagal" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const supabase = await createSupabaseServer();

  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!isAllowlistedEmail(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Nama file tidak diberikan" }, { status: 400 });
    }

    const { error } = await supabase.storage
      .from("media")
      .remove([name]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json({ error: "Hapus gagal" }, { status: 500 });
  }
}