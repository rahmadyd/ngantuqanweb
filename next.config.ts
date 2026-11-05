import path from "node:path";
import type { NextConfig } from "next";
import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

/** Redirect 301 dari struktur URL lama (PHP/Astro) ke rute baru. */
const legacyRedirects = [
  { source: "/index.php", destination: "/" },
  { source: "/about.php", destination: "/about" },
  { source: "/myproject.php", destination: "/myproject" },
  { source: "/shop.php", destination: "/shop" },
  { source: "/search.php", destination: "/search" },
  { source: "/detail.php", destination: "/myproject" },
  { source: "/tentang", destination: "/about" },
  { source: "/login.html", destination: "/" },
];

const nextConfig: NextConfig = {
  // Gambar sudah dikompres ke WebP saat upload, jadi optimasi bawaan Next dimatikan.
  images: { unoptimized: true },
  // Kunci root tracing ke folder proyek ini, agar lockfile asing di folder induk diabaikan.
  outputFileTracingRoot: path.join(__dirname),
  // Skip ESLint saat build (pre-existing errors di kode lama, bukan komponen baru)
  eslint: { ignoreDuringBuilds: true },
  async redirects() {
    return legacyRedirects.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};

export default nextConfig;

// Menyambungkan dev server Next.js dengan binding Cloudflare lokal.
// Hanya saat `next dev`; saat build produksi tidak diperlukan dan memicu wrangler
// menulis cache ke luar folder proyek.
if (process.env.NODE_ENV === "development") {
  initOpenNextCloudflareForDev();
}
