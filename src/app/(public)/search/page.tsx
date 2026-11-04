import type { Metadata } from "next";
import { isShopEnabled } from "@/lib/settings";
import { SearchClient } from "./SearchClient";
import { generateSearchMetadata } from "@/lib/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return generateSearchMetadata();
}

export default async function SearchPage() {
  const shopEnabled = await isShopEnabled();
  return <SearchClient shopEnabled={shopEnabled} />;
}
