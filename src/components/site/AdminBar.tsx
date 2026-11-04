"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { pageSlugFromPath } from "@/lib/nav";
import styles from "./AdminBar.module.css";

export function AdminBar() {
  const pathname = usePathname() ?? "/";
  const slug = pageSlugFromPath(pathname);

  return (
    <div className={styles.bar}>
      {slug ? (
        <Link className={styles.btn} href={`/studio/pages/${slug}/edit`}>
          ✏️ Edit halaman ini
        </Link>
      ) : null}
      <Link className={styles.btn} href="/studio">
        Studio
      </Link>
    </div>
  );
}
