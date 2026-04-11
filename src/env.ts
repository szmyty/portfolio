// During `next build`, NEXT_PHASE is set to 'phase-production-build'.
// Allowing fallbacks at build time lets the build succeed when production
// env vars are injected at runtime (e.g., on Vercel). At production runtime,
// the full validation runs and throws a clear error if a variable is missing.
const isDev = process.env.NODE_ENV !== "production";
const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";

function requireEnv(name: string, fallback?: string): string {
  const value = process.env[name];
  if (value) return value;
  if ((isDev || isBuildPhase) && fallback !== undefined) return fallback;
  throw new Error(
    `Missing required environment variable: ${name}. ` +
      `Set it in your .env file or deployment environment.`
  );
}

export const env = {
  NEXT_PUBLIC_SITE_URL: requireEnv(
    "NEXT_PUBLIC_SITE_URL",
    "http://localhost:3000"
  ),
} as const;
