/**
 * Centralized client-side storage key constants.
 *
 * All storage keys used across the application are defined here to
 * prevent duplication, reduce typo risk, and improve maintainability.
 *
 * Note: The anti-flicker inline <script> in layout.tsx reads the theme key
 * synchronously before React hydrates and cannot import modules, so it
 * hardcodes the string literal. Keep that value in sync with THEME_STORAGE_KEY.
 */

/** Tracks whether the user has passed the landing entry gate. */
export const LANDING_ENTERED_KEY = "landing-entered";

/**
 * Persists the user-selected theme preference ("light" | "dark" | "system")
 * in localStorage so it survives full browser restarts.
 *
 * Also referenced as a hardcoded string literal in the anti-flicker inline
 * script in src/app/layout.tsx — keep both values in sync.
 */
export const THEME_STORAGE_KEY = "theme-preference";
