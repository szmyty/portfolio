// Env config for shared-safe variables.

// IMPORTANT:
// - Access NEXT_PUBLIC_* variables directly so Next.js can inline them
// - Do NOT use dynamic lookups like process.env[name]
// - Provide a safe production fallback to avoid runtime crashes

const nextPublicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://szmyty.vercel.app";
const pinterestEgoHygieneRssUrl =
  process.env.PINTEREST_EGO_HYGIENE_RSS_URL?.trim() ||
  "https://www.pinterest.com/playfunctionmusic/ego-hygiene.rss";
const orcidId = process.env.ORCID_ID?.trim() || "";
const orcidRequireCredentials =
  process.env.ORCID_REQUIRE_CREDENTIALS?.trim() === "true";

export const env = {
  NEXT_PUBLIC_SITE_URL: nextPublicSiteUrl,
  PINTEREST_EGO_HYGIENE_RSS_URL: pinterestEgoHygieneRssUrl,
  ORCID_ID: orcidId,
  ORCID_REQUIRE_CREDENTIALS: orcidRequireCredentials,
} as const;

/** True only in `NODE_ENV=development` (local dev server). */
export const isDev = process.env.NODE_ENV === "development";

/** True only in `NODE_ENV=production`. */
export const isProd = process.env.NODE_ENV === "production";
