import type { ThemeMode } from "@portfolio/lib/theme";

export type ThemeToggleLabels = Record<ThemeMode, string>;

export type ThemeToggleProps = {
  /** Optional override for visible + accessible labels */
  labels?: ThemeToggleLabels;

  /** Accessible group label */
  ariaLabel?: string;

  /** Additional class names */
  className?: string;
};
