import type { Metadata } from "next";
import { isShopEnabled } from "@/lib/settings";
import { SearchClient } from "./SearchClient";

export async function generateMetadata(): Promise<Metadata> {
  return { title: "Pencarian" };
}

export default async function SearchPage() {
  const shopEnabled = await isShopEnabled();
  return <SearchClient shopEnabled={shopEnabled} />;
}
