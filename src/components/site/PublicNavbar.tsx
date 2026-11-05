"use client";

import Link from "next/link";
import { getPublicNav } from "@/lib/nav";
import styles from "./Header.module.css";

type PublicNavbarProps = {
  shopEnabled: boolean;
  pathname?: string;
};

export function PublicNavbar({ shopEnabled, pathname = "/" }: PublicNavbarProps) {
  const items = getPublicNav(shopEnabled);

  return (
    <nav className={styles.nav} aria-label="Utama">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={styles.link}
          passHref
          aria-current={pathname === item.href ? "page" : undefined}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
