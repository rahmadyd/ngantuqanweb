"use client";

import { usePathname } from "next/navigation";
import { pageSlugFromPath } from "@/lib/nav";
import styles from "./AdminBar.module.css";

export function AdminBar() {
  const pathname = usePathname() ?? "/";
  const slug = pageSlugFromPath(pathname);

  return (
    <div className={styles.bar}>
      {slug ? (
        <a className={styles.btn} href={`/studio/pages/${slug}/edit`}>
          ✏️ Edit halaman ini
        </a>
      ) : null}
      <a className={styles.btn} href="/studio">
        Studio
      </a>
    </div>
  );
}
