import type { Metadata, Viewport } from "next";
import { getAdminSession } from "@/lib/auth/session";
import { isShopEnabled } from "@/lib/settings";
import { PublicNavbar } from "@/components/site/PublicNavbar";
import { AdminSidebarWrapper } from "@/components/site/AdminSidebarWrapper";
import styles from "./studio.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio",
  robots: { index: false, follow: false },
  manifest: "/studio/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0C3B35",
};

export default async function StudioLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdminSession();
  const shopEnabled = await isShopEnabled();

  return (
    <div className={styles.shell}>
      <PublicNavbar shopEnabled={shopEnabled} />
      <header className={styles.top}>
        <span className={styles.brand}>Ngantuqan Studio</span>
      </header>
      <div className={styles.body}>
        <AdminSidebarWrapper />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}