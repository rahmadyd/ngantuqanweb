"use server";

import { redirect } from "next/navigation";
import { revalidateTag, revalidatePath } from "next/cache";
import { createSupabaseServer } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/session";
import type { PageContent } from "@/types/page-content";

export type EditActionState = {
  ok?: boolean;
  error?: string;
};

async function verifyAdminAndSupabase() {
  await assertAdmin();
  const supabase = await createSupabaseServer();
  return supabase;
}

export async function saveDraft(
  _prev: EditActionState,
  formData: FormData,
): Promise<EditActionState> {
  const slug = String(formData.get("slug") ?? "");
  const rawData = String(formData.get("pageData") ?? "");

  if (!slug || !rawData) {
    return { error: "Data halaman tidak lengkap." };
  }

  let parsed: PageContent;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    return { error: "Format data halaman tidak valid." };
  }

  try {
    const supabase = await verifyAdminAndSupabase();

    const { error } = await supabase
      .from("pages")
      .upsert({
        slug,
        title: parsed.root?.props?.title || slug,
        data: parsed,
        status: "draft",
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { error: "Gagal menyimpan draft." };
    }

    return { ok: true };
  } catch {
    return { error: "Gagal menyimpan draft. Pastikan Anda login sebagai admin." };
  }
}

export async function publishPage(
  _prev: EditActionState,
  formData: FormData,
): Promise<EditActionState> {
  const slug = String(formData.get("slug") ?? "");
  const rawData = String(formData.get("pageData") ?? "");

  if (!slug || !rawData) {
    return { error: "Data halaman tidak lengkap." };
  }

  let parsed: PageContent;
  try {
    parsed = JSON.parse(rawData);
  } catch {
    return { error: "Format data halaman tidak valid." };
  }

  try {
    const supabase = await verifyAdminAndSupabase();

    const { error } = await supabase
      .from("pages")
      .upsert({
        slug,
        title: parsed.root?.props?.title || slug,
        data: parsed,
        published_data: parsed,
        status: "published",
        updated_at: new Date().toISOString(),
      });

    if (error) {
      return { error: "Gagal menerbitkan halaman." };
    }

    // Revalidate cache so public pages pick up new published_data
    revalidateTag(`page:${slug}`);
    revalidatePath("/", "layout");
    revalidatePath(`/`, "layout");

    return { ok: true };
  } catch {
    return { error: "Gagal menerbitkan. Pastikan Anda login sebagai admin." };
  }
}

export async function deletePage(
  _prev: EditActionState,
  formData: FormData,
): Promise<EditActionState> {
  const slug = String(formData.get("slug") ?? "");

  if (!slug) {
    return { error: "Slug tidak valid." };
  }

  try {
    const supabase = await verifyAdminAndSupabase();

    const { error } = await supabase.from("pages").delete().eq("slug", slug);

    if (error) {
      return { error: "Gagal menghapus halaman." };
    }

    revalidateTag(`page:${slug}`);
    revalidatePath("/", "layout");

    redirect("/studio/pages");
    return { ok: true };
  } catch {
    return { error: "Gagal menghapus halaman. Pastikan Anda login sebagai admin." };
  }
}
