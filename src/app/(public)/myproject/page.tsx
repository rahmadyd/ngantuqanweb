import type { Metadata } from "next";
import { PlaceholderPage } from "@/components/site/PlaceholderPage";

export const metadata: Metadata = { title: "Project" };

export default function MyProjectPage() {
  return (
    <PlaceholderPage
      title="Project"
      body="Galeri karya dari tabel items (kategori project) menyusul di Fase 3."
    />
  );
}
