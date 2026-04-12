"use client";

import { useTheme } from "@portfolio/lib/theme";
import type { ThemeMode } from "@portfolio/lib/theme";

const CYCLE: ThemeMode[] = ["dark", "light", "system"];

const LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

/** Simple sun / moon / monitor glyphs — no external icon library required. */
const ICONS: Record<ThemeMode, string> = {
  light: "☀️",
  dark: "🌙",
  system: "🖥",
};

/**
 * ThemeToggle cycles through dark → light → system modes on each click.
 *
 * Displays the icon for the *current* mode and announces the *next* mode
 * as an accessible label so screen-reader users know what will happen.
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const currentIndex = CYCLE.indexOf(theme);
  const nextMode = CYCLE[(currentIndex + 1) % CYCLE.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(nextMode)}
      aria-label={`Switch to ${LABELS[nextMode]} mode`}
      title={`Theme: ${LABELS[theme]}`}
      className="pointer-events-auto flex items-center justify-center w-8 h-8 rounded-md text-text-muted hover:text-accent transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2"
    >
      <span aria-hidden="true">{ICONS[theme]}</span>
    </button>
  );
}
