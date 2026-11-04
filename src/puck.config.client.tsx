"use client";

import type { Config } from "@puckeditor/core";
import { HeroBlock } from "@/components/puck-blocks/HeroBlock";
import { MarqueeBlock } from "@/components/puck-blocks/MarqueeBlock";
import { AboutPillBlock } from "@/components/puck-blocks/AboutPillBlock";
import { ProjectGridBlock } from "@/components/puck-blocks/ProjectGridBlock";
import { ProductGridBlock } from "@/components/puck-blocks/ProductGridBlock";
import { CTABlock } from "@/components/puck-blocks/CTABlock";
import { CaseStudyBlock } from "@/components/puck-blocks/CaseStudyBlock";
import { GalleryBlock } from "@/components/puck-blocks/GalleryBlock";
import { TestimonialBlock } from "@/components/puck-blocks/TestimonialBlock";
import { TimelineBlock } from "@/components/puck-blocks/TimelineBlock";
import { ContactFormBlock } from "@/components/puck-blocks/ContactFormBlock";
import { StickerLayerBlock } from "@/components/puck-blocks/StickerLayerBlock";
import { RichTextBlock } from "@/components/puck-blocks/RichTextBlock";
import { SpacerBlock } from "@/components/puck-blocks/SpacerBlock";
import { ShopCTABlock } from "@/components/puck-blocks/ShopCTABlock";

const validBackgroundTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;
const validColorTokens = ["brume", "menthe", "limonade", "verveine", "paper"] as const;
const validPositions = ["top-left", "top-right", "bottom-left", "bottom-right", "center"] as const;

type Props = {
  hero: { title: string; subtitle: string; ctaText: string; ctaLink: string; backgroundToken: string; imageUrl: string };
  marquee: { text: string; direction: "left" | "right"; speed: number; color: string };
  aboutpill: { label: string; paragraph: string; linkText: string; linkUrl: string };
  projectgrid: { quantity: "4" | "6" | "all"; showFilter: boolean; showTab: boolean };
  productgrid: { quantity: "4" | "6" | "all"; showFeaturedOnly: boolean };
  cta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
  casestudy: { title: string; client: string; project: string; outcome: string; imageUrl: string };
  gallery: { images: string[]; columns: "2" | "3" | "4" };
  testimonial: { name: string; role: string; text: string; company: string; rating: number };
  timeline: { events: Array<{ title: string; date: string; description: string }> };
  contactform: { name: string; email: string; message: string };
  sticklayer: { imageUrl: string; label: string; position: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center" };
  richtext: { content: string };
  spacer: { size: "S" | "M" | "L" };
  shopcta: { title: string; subtitle: string; buttonText: string; buttonLink: string; backgroundToken: string };
};

export const config: Config<Props> = {
  components: {
    hero: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        ctaText: { type: "text", label: "Teks CTA" },
        ctaLink: { type: "text", label: "Link CTA" },
        backgroundToken: {
          type: "select",
          label: "Background",
          options: validBackgroundTokens.map(t => ({ value: t, label: t })),
        },
        imageUrl: { type: "text", label: "URL Gambar" },
      },
      defaultProps: {
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        backgroundToken: "brume",
        imageUrl: "",
      },
      render: HeroBlock,
    },
    marquee: {
      fields: {
        text: {
          type: "richtext",
          label: "Teks Marquee (pisahkan dengan baris baru)",
        },
        direction: {
          type: "select",
          label: "Arah",
          options: [
            { value: "left", label: "Kiri" },
            { value: "right", label: "Kanan" },
          ],
        },
        speed: { type: "number", label: "Kecepatan (1-50)" },
        color: {
          type: "select",
          label: "Warna",
          options: validColorTokens.map(t => ({ value: t, label: t })),
        },
      },
      defaultProps: {
        text: "Masukan teks marquee",
        direction: "left",
        speed: 20,
        color: "menthe",
      },
      render: MarqueeBlock,
    },
    aboutpill: {
      fields: {
        label: { type: "text", label: "Label Pill" },
        paragraph: { type: "richtext", label: "Paragraf" },
        linkText: { type: "text", label: "Teks Link" },
        linkUrl: { type: "text", label: "URL Link" },
      },
      defaultProps: {
        label: "Masukkan label",
        paragraph: "",
        linkText: "",
        linkUrl: "",
      },
      render: AboutPillBlock,
    },
    projectgrid: {
      fields: {
        quantity: {
          type: "select",
          label: "Jumlah",
          options: [
            { value: "4", label: "4" },
            { value: "6", label: "6" },
            { value: "all", label: "Semua" },
          ],
        },
        showFilter: { type: "checkbox", label: "Tampilkan Filter", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
        showTab: { type: "checkbox", label: "Tampilkan Tab", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
      },
      defaultProps: {
        quantity: "4",
        showFilter: true,
        showTab: false,
      },
      render: ProjectGridBlock,
    },
    productgrid: {
      fields: {
        quantity: {
          type: "select",
          label: "Jumlah",
          options: [
            { value: "4", label: "4" },
            { value: "6", label: "6" },
            { value: "all", label: "Semua" },
          ],
        },
        showFeaturedOnly: { type: "checkbox", label: "Hanya Featured", options: [{ value: true, label: "Ya" }, { value: false, label: "Tidak" }] },
      },
      defaultProps: {
        quantity: "4",
        showFeaturedOnly: false,
      },
      render: ProductGridBlock,
    },
    cta: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        buttonText: { type: "text", label: "Teks Tombol" },
        buttonLink: { type: "text", label: "Link Tombol" },
        backgroundToken: {
          type: "select",
          label: "Background",
          options: validBackgroundTokens.map(t => ({ value: t, label: t })),
        },
      },
      defaultProps: {
        title: "",
        subtitle: "",
        buttonText: "Baca lebih lanjut",
        buttonLink: "",
        backgroundToken: "brume",
      },
      render: CTABlock,
    },
    casestudy: {
      fields: {
        title: { type: "text", label: "Judul Case Study" },
        client: { type: "text", label: "Klien" },
        project: { type: "text", label: "Nama Proyek" },
        outcome: { type: "richtext", label: "Hasil/Outcome" },
        imageUrl: { type: "text", label: "URL Gambar" },
      },
      defaultProps: {
        title: "Case Study",
        client: "",
        project: "",
        outcome: "",
        imageUrl: "",
      },
      render: CaseStudyBlock,
    },
    gallery: {
      fields: {
        images: {
          type: "array",
          label: "Gambar",
          arrayFields: { type: "text", label: "URL Gambar" },
        },
        columns: {
          type: "select",
          label: "Kolom",
          options: [
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
          ],
        },
      },
      defaultProps: {
        images: [],
        columns: "3",
      },
      render: GalleryBlock,
    },
    testimonial: {
      fields: {
        name: { type: "text", label: "Nama" },
        role: { type: "text", label: "Peran/Jabatan" },
        text: { type: "richtext", label: "Kutipan" },
        company: { type: "text", label: "Perusahaan" },
        rating: { type: "number", label: "Rating (1-5)", min: 1, max: 5, step: 1 },
      },
      defaultProps: {
        name: "",
        role: "",
        text: "",
        company: "",
        rating: 5,
      },
      render: TestimonialBlock,
    },
    timeline: {
      fields: {
        events: {
          type: "array",
          label: "Event",
          arrayFields: {
            title: { type: "text", label: "Judul Event" },
            date: { type: "text", label: "Tanggal" },
            description: { type: "richtext", label: "Deskripsi" },
          },
        },
      },
      defaultProps: {
        events: [
          { title: "Event 1", date: "", description: "" },
          { title: "Event 2", date: "", description: "" },
        ],
      },
      render: TimelineBlock,
    },
    contactform: {
      fields: {
        name: { type: "text", label: "Nama" },
        email: { type: "text", label: "Email" },
        message: { type: "richtext", label: "Pesan" },
      },
      defaultProps: {
        name: "",
        email: "",
        message: "",
      },
      render: ContactFormBlock,
    },
    sticklayer: {
      fields: {
        imageUrl: { type: "text", label: "URL Gambar Stiker" },
        label: { type: "text", label: "Label (aria-label)" },
        position: {
          type: "select",
          label: "Posisi",
          options: validPositions.map(p => ({ value: p, label: p })),
        },
      },
      defaultProps: {
        imageUrl: "",
        label: "",
        position: "top-right",
      },
      render: StickerLayerBlock,
    },
    richtext: {
      fields: {
        content: { type: "richtext", label: "Konten HTML" },
      },
      defaultProps: {
        content: "",
      },
      render: RichTextBlock,
    },
    spacer: {
      fields: {
        size: {
          type: "select",
          label: "Ukuran",
          options: [
            { value: "S", label: "Kecil (S)" },
            { value: "M", label: "Sedang (M)" },
            { value: "L", label: "Besar (L)" },
          ],
        },
      },
      defaultProps: {
        size: "M",
      },
      render: SpacerBlock,
    },
    shopcta: {
      fields: {
        title: { type: "text", label: "Judul" },
        subtitle: { type: "text", label: "Subjudul" },
        buttonText: { type: "text", label: "Teks Tombol" },
        buttonLink: { type: "text", label: "Link Tombol" },
        backgroundToken: {
          type: "select",
          label: "Background",
          options: validBackgroundTokens.map(t => ({ value: t, label: t })),
        },
      },
      defaultProps: {
        title: "Cek Produk Kami",
        subtitle: "Temukan produk kreatif yang cocok untuk Anda.",
        buttonText: "Lihat Toko",
        buttonLink: "/shop",
        backgroundToken: "verveine",
      },
      render: ShopCTABlock,
    },
  },
};

export default config;