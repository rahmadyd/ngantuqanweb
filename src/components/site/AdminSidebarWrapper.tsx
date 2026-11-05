"use client";

import { usePathname } from "next/navigation";
import AdminSidebar from "./AdminSidebar";

export function AdminSidebarWrapper() {
  const pathname = usePathname();
  return <AdminSidebar currentPath={pathname} />;
}