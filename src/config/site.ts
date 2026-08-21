import { env } from "./env";

export const siteConfig = {
  name: "Alan Szmyt | Portfolio",
  title: {
    default: "Alan Szmyt | Portfolio",
    template: "%s | Alan Szmyt",
  },
  description:
    "Software engineer building reliable developer platforms, local-first systems, and AI-assisted workflows.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: {
    name: "Alan Szmyt",
    handle: "@szmyty",
    jobTitle: "Software Engineer",
    email: "szmyty@gmail.com",
    github: "https://github.com/szmyty",
    linkedin: "https://linkedin.com/in/alanszmyt",
  },
  githubRepoUrl: "https://github.com/szmyty/portfolio",
  keywords: [
    "Alan Szmyt",
    "software engineer",
    "developer platforms",
    "developer experience",
    "local-first software",
    "AI-assisted workflows",
    "portfolio",
  ] as string[],
  locale: "en_US",
} as const;

export const researchConfig = {
  orcidId: env.ORCID_ID,
  requireCredentials: env.ORCID_REQUIRE_CREDENTIALS,
} as const;
