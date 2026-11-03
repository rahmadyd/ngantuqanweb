import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const metadata: Metadata = { title: "Tentang" };

export default function AboutPage() {
  return (
    <PlaceholderPage
      title="Tentang"
      body="Halaman ini nanti disusun lewat Studio (Puck). Profil dan timeline menyusul di Fase 4."
    />
  );
}
