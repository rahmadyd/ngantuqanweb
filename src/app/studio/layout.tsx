import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Button } from "@/components/ui";
import { getAdminSession } from "@/lib/auth/session";
import { signOut } from "./actions";
import styles from "./studio.module.css";

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

  return (
    <div className={styles.shell}>
      <header className={styles.top}>
        <span className={styles.brand}>Ngantuqan Studio</span>
        {admin ? (
          <div className={styles.actions}>
            <span className="sr-only">Masuk sebagai {admin.email}</span>
            <Link href="/" passHref>
              <Button variant="secondary" size="sm">
                Kembali ke situs
              </Button>
            </Link>
            <form action={signOut}>
              <Button type="submit" variant="secondary" size="sm">
                Keluar
              </Button>
            </form>
          </div>
        ) : null}
      </header>
      <div className={styles.main}>{children}</div>
    </div>
  );
}
