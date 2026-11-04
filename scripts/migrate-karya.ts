import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { getSupabaseUrl, getSupabaseAnonKey } from "../src/lib/supabase/env";
import matter from "gray-matter";

const url = getSupabaseUrl();
const key = getSupabaseAnonKey();

if (!url || !key) {
  console.error("Supabase URL/Key not configured");
  process.exit(1);
}

const supabase = createClient(url, key);
const karyaDir = join(process.cwd(), "content", "karya");

interface KaryaFrontmatter {
  slug: string;
  kind: "project" | "shop";
  title: string;
  cover_image?: string;
  images?: string[];
  summary?: string;
  body?: string;
  price_idr?: number;
  order_url?: string;
  is_featured?: boolean;
  is_published?: boolean;
  is_sold_out?: boolean;
  sort_order?: number;
}

async function migrate() {
  console.log("Reading karya files from:", karyaDir);
  
  const files = readdirSync(karyaDir).filter(f => f.endsWith(".md"));
  console.log(`Found ${files.length} markdown files`);

  for (const file of files) {
    const content = readFileSync(join(karyaDir, file), "utf-8");
    const { data: fm, content: body } = matter(content) as unknown as { data: KaryaFrontmatter; content: string };

    // Validasi required fields
    if (!fm.slug || !fm.kind || !fm.title) {
      console.warn(`⚠️  Skip ${file}: missing required fields (slug, kind, title)`);
      continue;
    }

    const itemData = {
      slug: fm.slug,
      kind: fm.kind,
      title: fm.title,
      summary: fm.summary || "",
      body_md: body,
      cover_image: fm.cover_image || null,
      images: fm.images || [],
      role: null,
      client: null,
      year: null,
      price_idr: fm.price_idr || null,
      order_url: fm.order_url || null,
      live_url: null,
      repo_url: null,
      is_featured: fm.is_featured ?? false,
      is_sold_out: fm.is_sold_out ?? false,
      is_published: fm.is_published ?? true,
      sort_order: fm.sort_order ?? 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("items").upsert(itemData, { onConflict: "slug" });
    if (error) {
      console.error(`❌ ${fm.slug}:`, error.message);
    } else {
      console.log(`✅ ${fm.slug} (${fm.kind})`);
    }
  }

  console.log("Migration done!");
}

migrate();