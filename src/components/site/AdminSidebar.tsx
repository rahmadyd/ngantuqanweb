"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import styles from "./AdminSidebar.module.css";

const NAV_ITEMS = [
  { href: "/studio", label: "Dashboard", icon: "🏠" },
  { href: "/studio/pages", label: "Halaman", icon: "📄" },
  { href: "/studio/items", label: "Karya", icon: "🖼️" },
  { href: "/studio/media", label: "Media", icon: "🖼️" },
  { href: "/studio/messages", label: "Pesan", icon: "✉️" },
  { href: "/studio/settings", label: "Pengaturan", icon: "⚙️" },
];

export default function AdminSidebar({ currentPath }: { currentPath: string }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleResize = () => setCollapsed(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <aside className={`${styles.sidebar} ${collapsed ? styles.collapsed : ""}`}>
      <div className={styles.sidebarHeader}>
        {mounted && (
          <span className={styles.toggle} onClick={() => setCollapsed(!collapsed)} aria-label="Toggle sidebar">
            ☰
          </span>
        )}
        <span className={styles.brand}>Studio</span>
      </div>
      <nav className={styles.nav} aria-label="Admin navigation">
        {NAV_ITEMS.map((item) => {
          const isActive = window.location.pathname === item.href || window.location.pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.item} ${window.location.pathname.startsWith(item.href) ? styles.active : ""}`}
              onClick={() => {
                if (window.innerWidth < 768) {
                  document.body.style.overflow = "";
                  document.querySelector(".sidebar-overlay")?.remove();
                }
              }}
            >
              <span className={styles.icon}>{item.icon}</span>
              {!collapsed && <span className={styles.label}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}