import { env } from "./env";

export const siteConfig = {
  name: "Alan Szmyt | Portfolio",
  title: {
    default: "Alan Szmyt | Portfolio",
    template: "%s | Alan Szmyt",
  },
  description:
    "Personal portfolio of Alan Szmyt — software engineer focused on building thoughtful, reliable systems.",
  url: env.NEXT_PUBLIC_SITE_URL,
  author: {
    name: "Alan Szmyt",
    handle: "@szmyty",
    jobTitle: "Software Engineer",
    github: "https://github.com/szmyty",
    linkedin: "https://linkedin.com/in/alanszmyt",
  },
  keywords: [
    "Alan Szmyt",
    "software engineer",
    "portfolio",
    "full-stack",
    "web development",
  ] as string[],
  locale: "en_US",
} as const;
