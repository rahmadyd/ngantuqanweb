/** @type {import('@puckeditor/core').Config} */
export default {
  // 6 block inti Fase 4
  blocks: {
    hero: {
      name: "Hero",
      defaultContent: {
        type: "hero",
        title: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        backgroundToken: "brume",
        imageUrl: "",
      },
      validate: (props: { backgroundToken?: string }) => {
        const validTokens = ["brume", "menthe", "limonade", "verveine", "paper"];
        if (props.backgroundToken && !validTokens.includes(props.backgroundToken)) {
          return `backgroundToken harus salah satu dari: ${validTokens.join(", ")}`;
        }
        return null;
      },
    },
    marquee: {
      name: "Marquee",
      defaultContent: {
        type: "marquee",
        texts: ["Masukan teks marquee"],
        direction: "left",
        speed: 20,
        color: "menthe",
      },
      validate: (props: { color?: string }) => {
        const validTokens = ["brume", "menthe", "limonade", "verveine", "paper"];
        if (props.color && !validTokens.includes(props.color)) {
          return `color harus salah satu dari: ${validTokens.join(", ")}`;
        }
        return null;
      },
    },
    aboutpill: {
      name: "AboutPill",
      defaultContent: {
        type: "aboutpill",
        label: "Masukkan label",
        paragraph: "",
        linkText: "",
        linkUrl: "",
      },
    },
    projectgrid: {
      name: "ProjectGrid",
      defaultContent: {
        type: "projectgrid",
        quantity: "4",
        showFilter: true,
        showTab: false,
      },
    },
    productgrid: {
      name: "ProductGrid",
      defaultContent: {
        type: "productgrid",
        quantity: "4",
        showFeaturedOnly: false,
      },
    },
    cta: {
      name: "CTA",
      defaultContent: {
        type: "cta",
        title: "",
        subtitle: "",
        buttonText: "Baca lebih lanjut",
        buttonLink: "",
        backgroundToken: "brume",
      },
      validate: (props: { backgroundToken?: string }) => {
        const validTokens = ["brume", "menthe", "limonade", "verveine", "paper"];
        if (props.backgroundToken && !validTokens.includes(props.backgroundToken)) {
          return `backgroundToken harus salah satu dari: ${validTokens.join(", ")}`;
        }
        return null;
      },
    },
  },

  // Global style guardrails
  style: {
    // Warna blok hanya dari token
    color: ["brume", "menthe", "limonade", "verveine", "paper"],
    // Ukuran S/M/L (tidak ada px bebas)
    size: ["small", "medium", "large"],
  },
};