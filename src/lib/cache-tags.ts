export const CACHE_TAGS = {
  settings: "settings",
  items: "items",
  page: (slug: string) => `page:${slug}`,
} as const;
