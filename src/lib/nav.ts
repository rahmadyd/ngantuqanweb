export type NavItem = {
  href: string;
  label: string;
};

export function getPublicNav(shopEnabled: boolean): NavItem[] {
  const items: NavItem[] = [
    { href: "/", label: "Home" },
    { href: "/myproject", label: "Project" },
  ];
  if (shopEnabled) {
    items.push({ href: "/shop", label: "Shop" });
  }
  items.push(
    { href: "/about", label: "About" },
    { href: "/search", label: "Cari" },
  );
  return items;
}

const RESERVED_FIRST_SEGMENTS = new Set([
  "myproject",
  "shop",
  "search",
  "karya",
  "studio",
  "api",
  "auth",
  "_next",
]);

export function pageSlugFromPath(pathname: string): string | null {
  if (pathname === "/") return "home";
  if (pathname === "/about") return "about";
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment || RESERVED_FIRST_SEGMENTS.has(segment)) return null;
  return segment;
}
