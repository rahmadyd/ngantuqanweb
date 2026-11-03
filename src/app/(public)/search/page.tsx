import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const metadata: Metadata = { title: "Cari" };

export default function SearchPage() {
  return (
    <PlaceholderPage
      title="Cari"
      body="Pencarian karya menyusul setelah data items di Fase 3."
    />
  );
}
