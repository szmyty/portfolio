import type { Metadata } from "next";
import { siteConfig } from "@portfolio/config/site";

const routeMetadata = {
  "/development": {
    title: "Development",
    description:
      "Selected engineering case studies, professional experience, and public GitHub systems by Alan Szmyt.",
  },
  "/music": {
    title: "Music",
    description:
      "Original music, production work, and sound experiments by Alan Szmyt.",
  },
  "/publishing": {
    title: "Publishing",
    description: "Articles, comics, and published creative work by Alan Szmyt.",
  },
  "/research": {
    title: "Research",
    description:
      "Publications, research artifacts, and semantic knowledge systems by Alan Szmyt.",
  },
  "/insights": {
    title: "Insights",
    description:
      "Visual knowledge artifacts about emotional awareness, personal growth, and reflective self-development.",
  },
} as const;

export type PortfolioRoute = keyof typeof routeMetadata;

export function createRouteMetadata(route: PortfolioRoute): Metadata {
  const { title, description } = routeMetadata[route];

  return {
    title,
    description,
    alternates: {
      canonical: route,
    },
    openGraph: {
      type: "website",
      url: route,
      title: `${title} | Alan Szmyt`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Alan Szmyt`,
      description,
      creator: siteConfig.author.handle,
    },
  };
}
