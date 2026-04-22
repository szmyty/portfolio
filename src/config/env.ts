// Env config for client-safe variables (NEXT_PUBLIC_*)

// IMPORTANT:
// - Access NEXT_PUBLIC_* variables directly so Next.js can inline them
// - Do NOT use dynamic lookups like process.env[name]
// - Provide a safe production fallback to avoid runtime crashes

const nextPublicSiteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://szmyty.vercel.app";

export const env = {
  NEXT_PUBLIC_SITE_URL: nextPublicSiteUrl,
} as const;

/** True only in `NODE_ENV=development` (local dev server). */
export const isDev = process.env.NODE_ENV === "development";

/** True only in `NODE_ENV=production`. */
export const isProd = process.env.NODE_ENV === "production";