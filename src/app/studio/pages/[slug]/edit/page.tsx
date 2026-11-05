"use server";

import { createSupabaseServer } from "@/lib/supabase/server";
import { assertAdmin } from "@/lib/auth/session";
import { PageEditor } from "./PageEditor";
import type { PageContent } from "@/types/page-content";
import { notFound } from "next/navigation";

export async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  await assertAdmin();

  const supabase = await createSupabaseServer();

  const { data: pageData, error } = await supabase
    .from("pages")
    .select("slug, title, data, published_data, status")
    .eq("slug", slug)
    .single();

  if (error || !pageData) {
    notFound();
  }

  const initialData: PageContent =
    (pageData.data as PageContent) || {
      root: { props: { title: pageData.title || slug }, content: [] },
    };

  return (
    <div>
      <PageEditor
        slug={pageData.slug}
        pageTitle={pageData.title || slug}
        initialData={initialData}
        isPublished={pageData.status === "published"}
      />
    </div>
  );
}
