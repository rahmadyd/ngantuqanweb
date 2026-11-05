export const homeData = {
  hero: {
    title: "Ngantuqan",
    subtitle: "Portofolio visual dan toko karya kreatif",
    tagline: "Portofolio & toko karya",
    ctaPrimary: { label: "Lihat Karya", href: "/myproject" },
    ctaSecondary: { label: "Ke Toko", href: "/shop" },
  },
  nav: {
    marqueeText: "Ngantuqan",
  },
  about: {
    consoleLines: [
      "Selamat datang di Ngantuqan",
      "Kami menciptakan karya visual",
      "Dari konsep hingga realisasi",
      "Setiap detail dihitung dengan teliti",
    ],
    ctaLabel: "Tentang Kami",
    ctaHref: "/about",
  },
  separator1: {
    label: "Karya Terbaru",
  },
  latestWorks: {
    label: "KARYA",
    items: [
      { id: 1, title: "Branding Kopi Lokal", category: "Branding", image: "/placeholders/hero-1.svg" },
      { id: 2, title: "Website Portfolio", category: "Web", image: "/placeholders/hero-2.svg" },
      { id: 3, title: "Sticker Pack Karya", category: "Ilustrasi", image: "/placeholders/hero-3.svg" },
      { id: 4, title: "Tote Bag Karya", category: "Merch", image: "/placeholders/hero-4.svg" },
    ],
    ctaLabel: "Lihat semua karya",
    ctaHref: "/myproject",
  },
  separator2: {
    label: "Produk",
  },
  products: {
    items: [
      { id: 1, name: "Sticker Pack", price: 45000, image: "/placeholders/hero-5.svg" },
      { id: 2, name: "Tote Bag", price: 85000, image: "/placeholders/hero-6.svg" },
      { id: 3, name: "Poster A3", price: 65000, image: "/placeholders/hero-1.svg" },
    ],
    ctaLabel: "Beli sekarang",
  },
  howItWorks: {
    steps: [
      { number: 1, title: "Ngobrol", description: "Diskusikan ide dan kebutuhan Anda", icon: "chat" as const },
      { number: 2, title: "Desain", description: "Kami rancang konsep visual terbaik", icon: "design" as const },
      { number: 3, title: "Jadi", description: "Hasil siap pakai & berkualitas", icon: "done" as const },
    ],
  },
  contact: {
    title: "Hubungi Kami",
    fields: [
      { name: "name", label: "Nama", type: "text" as const, placeholder: "Nama Anda" },
      { name: "email", label: "Email", type: "email" as const, placeholder: "email@contoh.com" },
      { name: "message", label: "Pesan", type: "textarea" as const, placeholder: "Tulis pesan Anda di sini..." },
    ],
    submitLabel: "Go",
    comingSoonMessage: "Segera hadir",
  },
  footer: {
    marqueeText: "Ngantuqan",
    socialLinks: [
      { label: "Instagram", href: "#" },
      { label: "Twitter", href: "#" },
      { label: "Email", href: "#" },
    ],
    copyright: "© 2025 Ngantuqan. Karya visual, project, dan merch.",
  },
};

export type HomeData = typeof homeData;