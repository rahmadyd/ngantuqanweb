import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServer } from "@/lib/supabase/server";
import { isShopEnabled } from "@/lib/settings";
import { generateHomeMetadata } from "@/lib/metadata";
import { homeData } from "@/content/home";
import {
  Hero,
  NavBar,
  About,
  Separator,
  LatestWorks,
  Products,
  HowItWorks,
  Contact,
  Footer,
} from "@/components/home";
import { getPublicNav } from "@/lib/nav";
import type { ItemRow } from "@/lib/supabase/database";
import { getOrderAction } from "@/lib/order";

export const revalidate = 0;

export async function generateMetadata(): Promise<Metadata> {
  return generateHomeMetadata();
}

interface LatestWorkItem {
  id: number;
  title: string;
  category: string;
  image: string;
  slug: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  image: string;
  slug: string;
  is_sold_out: boolean;
  order_url: string | null;
  order_label: string | null;
}

function mapProjectToLatestWork(project: ItemRow, index: number): LatestWorkItem {
  const category = project.tags?.[0] || "Project";
  return {
    id: index + 1,
    title: project.title,
    category,
    image: project.cover_image || `/placeholders/hero-${index + 1}.svg`,
    slug: project.slug,
  };
}

function mapProductToProductItem(product: ItemRow, index: number, settings: Awaited<ReturnType<typeof import("@/lib/settings").getSettings>>): ProductItem {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const orderAction = getOrderAction(
    {
      order_url: product.order_url,
      order_label: product.order_label,
      title: product.title,
      slug: product.slug,
      is_sold_out: product.is_sold_out,
      kind: "shop" as const,
    },
    {
      wa_number: settings.wa_number,
      order_button_label: settings.order_button_label,
    },
    baseUrl,
  );

  return {
    id: index + 1,
    name: product.title,
    price: product.price_idr || 0,
    image: product.cover_image || `/placeholders/hero-${index + 1}.svg`,
    slug: product.slug,
    is_sold_out: product.is_sold_out,
    order_url: orderAction?.href || "",
    order_label: orderAction?.label || settings.order_button_label,
  };
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const code = typeof params.code === "string" ? params.code : undefined;
  if (code) {
    redirect(`/auth/callback?code=${code}`);
  }

  const [shopEnabled, settings, supabase] = await Promise.all([
    isShopEnabled(),
    (async () => {
      const { getSettings } = await import("@/lib/settings");
      return getSettings();
    })(),
    createSupabaseServer(),
  ]);
  const navItems = getPublicNav(shopEnabled);

  // Fetch latest works (projects) - 4 most recent
  const { data: projects, error: projectsError } = await supabase
    .from("items")
    .select("*")
    .eq("kind", "project")
    .eq("is_published", true)
    .order("sort_order")
    .limit(4);

  if (projectsError) {
    console.error("Gagal memuat karya terbaru:", projectsError);
  }

  // Fetch products (shop items) - 3 most recent
  const { data: products, error: productsError } = await supabase
    .from("items")
    .select("*")
    .eq("kind", "shop")
    .eq("is_published", true)
    .order("sort_order")
    .limit(3);

  if (productsError) {
    console.error("Gagal memuat produk:", productsError);
  }

  const latestWorksItems: LatestWorkItem[] = (projects || []).map(mapProjectToLatestWork);
  const productItems: ProductItem[] = (products || []).map((p, i) => mapProductToProductItem(p, i, settings));

  return (
    <>
      <Hero
        title={homeData.hero.title}
        subtitle={homeData.hero.subtitle}
        tagline={homeData.hero.tagline}
        ctaPrimary={homeData.hero.ctaPrimary}
        ctaSecondary={homeData.hero.ctaSecondary}
        shopEnabled={shopEnabled}
      />
      <NavBar items={navItems} pathname="/" marqueeText={homeData.nav.marqueeText} />
      <About consoleLines={homeData.about.consoleLines} ctaLabel={homeData.about.ctaLabel} ctaHref={homeData.about.ctaHref} />
      <Separator label={homeData.separator1.label} background="verveine" />
      <LatestWorks
        label={homeData.latestWorks.label}
        items={latestWorksItems.length > 0 ? latestWorksItems : homeData.latestWorks.items}
        ctaLabel={homeData.latestWorks.ctaLabel}
        ctaHref={homeData.latestWorks.ctaHref}
      />
      <Separator label={homeData.separator2.label} background="menthe" />
      <Products items={productItems.length > 0 ? productItems : homeData.products.items} ctaLabel={homeData.products.ctaLabel} shopEnabled={shopEnabled} />
      <HowItWorks steps={homeData.howItWorks.steps} />
      <Contact
        title={homeData.contact.title}
        fields={homeData.contact.fields}
        submitLabel={homeData.contact.submitLabel}
        comingSoonMessage={homeData.contact.comingSoonMessage}
      />
      <Footer
        marqueeText={homeData.footer.marqueeText}
        socialLinks={homeData.footer.socialLinks}
        copyright={homeData.footer.copyright}
      />
    </>
  );
}