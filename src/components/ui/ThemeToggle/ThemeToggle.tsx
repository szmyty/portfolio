"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Icon } from "@portfolio/components/ui/Icon";
import { useTheme } from "@portfolio/lib/theme";
import type { ThemeMode } from "@portfolio/lib/theme";

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

const OPTIONS: ThemeMode[] = ["dark", "light", "system"];

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Theme selection"
      className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-border bg-surface-overlay p-1 shadow-[0_0_0_1px_color-mix(in_srgb,var(--border)_55%,transparent)] backdrop-blur-md"
    >
      {OPTIONS.map((mode) => {
        const isActive = theme === mode;

        return (
          <button
            key={mode}
            type="button"
            onClick={() => setTheme(mode)}
            aria-pressed={isActive}
            aria-label={`Use ${LABELS[mode]} theme`}
            title={LABELS[mode]}
            className={[
              "flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200",
              "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
              isActive
                ? "bg-accent text-accent-foreground shadow-[0_10px_25px_-14px_color-mix(in_srgb,var(--accent)_90%,transparent)]"
                : "text-text-muted hover:bg-surface-raised hover:text-text-primary",
            ].join(" ")}
          >
            <Icon icon={ICONS[mode]} size={16} />
          </button>
        );
      })}
    </div>
  );
}
