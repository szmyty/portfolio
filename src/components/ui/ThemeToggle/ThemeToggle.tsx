"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@portfolio/components/ui/Icon";
import { useTheme } from "@portfolio/lib/theme";
import type { ThemeMode } from "@portfolio/lib/theme";

const CYCLE: ThemeMode[] = ["dark", "light", "system"];

const LABELS: Record<ThemeMode, string> = {
  light: "Light",
  dark: "Dark",
  system: "System",
};

const ICONS: Record<ThemeMode, LucideIcon> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
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
      <Icon icon={ICONS[theme]} size={16} />
    </button>
  );
}
