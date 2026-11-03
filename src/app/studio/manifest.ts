import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ngantuqan Studio",
    short_name: "Studio",
    description: "Admin Ngantuqan",
    start_url: "/studio",
    display: "standalone",
    background_color: "#C2F2E4",
    theme_color: "#0C3B35",
  };
}
