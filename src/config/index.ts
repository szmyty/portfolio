/**
 * Centralized configuration layer — public API.
 *
 * Import environment variables, feature flags, and site metadata from this
 * module rather than reaching into individual files or reading `process.env`
 * directly. This keeps consumers decoupled from the internal layout and makes
 * future refactoring easier.
 *
 * @example
 * ```ts
 * import { env, isDev, siteConfig } from "@portfolio/config";
 * ```
 */

export { env, isDev, isProd } from "./env";
export { siteConfig } from "./site";
