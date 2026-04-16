import type { MetadataRoute } from "next";
import { siteConfig } from "@portfolio/config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "Portfolio",
    description: siteConfig.description,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#050509",
    theme_color: "#050509",
    categories: ["portfolio", "developer", "music", "technology"],
    icons: [
      {
        src: "/icons/app/icon-128x128.png",
        sizes: "128x128",
        type: "image/png",
      },
      {
        src: "/icons/app/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/app/icon-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/icons/app/icon-384x384.png",
        sizes: "384x384",
        type: "image/png",
      },
      {
        src: "/icons/app/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
