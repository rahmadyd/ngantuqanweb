import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Button } from "@/components/ui";
import { getAdminSession } from "@/lib/auth/session";
import { isShopEnabled } from "@/lib/settings";
import { PublicNavbar } from "@/components/site/PublicNavbar";
import AdminSidebar from "./AdminSidebar";
import styles from "./AdminLayout.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getAdminSession();
  const shopEnabled = await isShopEnabled();

  return (
    <div className={styles.root}>
      <PublicNavbar shopEnabled={shopEnabled} />
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandText}>Ngantuqan Studio</span>
        </div>
        <div className={styles.actions}>
          {admin && <span className={styles.userEmail}>{admin.email}</span>}
        </div>
      </header>
      <div className={styles.body}>
        <AdminSidebar currentPath={typeof window !== "undefined" ? window.location.pathname : "/studio"} />
        <main className={styles.main}>{children}</main>
      </div>
    </div>
  );
}