import { createClient } from "@supabase/supabase-js";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(process.cwd(), ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("Supabase URL/Service Role Key not configured");
  console.error("Make sure .env.local exists with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

const homePageData = {
  content: [
    {
      type: "hero",
      props: {
        title: "Ngantuqan",
        subtitle: "Portofolio visual + toko karya kreatif",
        ctaText: "Lihat Proyek",
        ctaLink: "/myproject",
        backgroundToken: "brume",
        imageUrl: "",
      },
    },
    {
      type: "marquee",
      props: {
        text: "Desain · Branding · Web · Ilustrasi · Merch",
        direction: "left",
        speed: 20,
        color: "menthe",
      },
    },
    {
      type: "aboutpill",
      props: {
        label: "Tentang Kami",
        paragraph: "Ngantuqan adalah studio kreatif yang membuat identitas visual, website, dan produk merch dengan sentuhan unik. Kami percaya desain yang baik lahir dari kolaborasi yang jujur dan proses yang transparan.",
        linkText: "Baca Selengkapnya",
        linkUrl: "/about",
      },
    },
    {
      type: "projectgrid",
      props: {
        quantity: "4",
        showFilter: true,
        showTab: false,
      },
    },
    {
      type: "productgrid",
      props: {
        quantity: "4",
        showFeaturedOnly: true,
      },
    },
    {
      type: "cta",
      props: {
        title: "Mari Bekerja Sama",
        subtitle: "Punya proyek di pikiran? Kami siap bantu mewujudkannya.",
        buttonText: "Hubungi Kami",
        buttonLink: "/karya/kontak",
        backgroundToken: "verveine",
      },
    },
  ],
  root: {
    props: {
      title: "Ngantuqan",
    },
  },
};

const aboutPageData = {
  content: [
    {
      type: "hero",
      props: {
        title: "Tentang Ngantuqan",
        subtitle: "Studio kreatif kecil dengan hati besar",
        ctaText: "",
        ctaLink: "",
        backgroundToken: "limonade",
        imageUrl: "",
      },
    },
    {
      type: "aboutpill",
      props: {
        label: "Filosofi",
        paragraph: "Kami percaya bahwa desain terbaik lahir dari pemahaman mendalam tentang kebutuhan klien dan konteks budaya. Setiap proyek ditangani dengan pendekatan personal, bukan template.",
        linkText: "",
        linkUrl: "",
      },
    },
    {
      type: "richtext",
      props: {
        content: "<h2>Layanan Kami</h2><ul><li>Branding & Identitas Visual</li><li>Desain Website & UI/UX</li><li>Ilustrasi & Grafis Kustom</li><li>Merch & Produk Fisik</li></ul><h2>Cara Kerja</h2><p>1. Diskusi kebutuhan & riset<br/>2. Konsep & presentasi<br/>3. Revisi & finalisasi<br/>4. Handoff & dukungan</p>",
      },
    },
    {
      type: "cta",
      props: {
        title: "Siap Memulai Proyek?",
        subtitle: "Ceritakan ide Anda dan mari kita wujudkan bersama.",
        buttonText: "Mulai Diskusi",
        buttonLink: "/karya/kontak",
        backgroundToken: "verveine",
      },
    },
  ],
  root: {
    props: {
      title: "Tentang Kami",
    },
  },
};

async function seed() {
  console.log("Seeding home page...");
  const { error: homeError } = await supabase.from("pages").upsert({
    slug: "home",
    title: "Ngantuqan",
    data: homePageData,
    published_data: homePageData,
    status: "published",
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });

  if (homeError) {
    console.error("❌ Home page:", homeError.message);
  } else {
    console.log("✅ Home page seeded");
  }

  console.log("Seeding about page...");
  const { error: aboutError } = await supabase.from("pages").upsert({
    slug: "about",
    title: "Tentang Kami",
    data: aboutPageData,
    published_data: aboutPageData,
    status: "published",
    updated_at: new Date().toISOString(),
  }, { onConflict: "slug" });

  if (aboutError) {
    console.error("❌ About page:", aboutError.message);
  } else {
    console.log("✅ About page seeded");
  }

  console.log("Seeding done!");
}

seed();