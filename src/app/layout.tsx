import type { Metadata } from "next";
import { Bagel_Fat_One, DM_Sans } from "next/font/google";
import "./globals.css";

const displayFont = Bagel_Fat_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-bagel",
  display: "swap",
});

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Ngantuqan",
    template: "%s · Ngantuqan",
  },
  description:
    "Portofolio visual dan toko karya Ngantuqan. Project, ilustrasi, dan produk digital.",
  openGraph: {
    type: "website",
    siteName: "Ngantuqan",
    locale: "id_ID",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>{children}</body>
    </html>
  );
}
