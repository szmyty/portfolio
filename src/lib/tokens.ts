/**
 * Design tokens — TypeScript references for the CSS custom properties defined
 * in `globals.css`.
 *
 * Use these constants wherever you need to reference a token from
 * JavaScript/TypeScript (e.g., inline `style` props, Framer Motion values).
 * For Tailwind utility classes, use the semantic names directly
 * (e.g., `text-text-primary`, `bg-background`).
 */
export const tokens = {
  color: {
    background: "var(--background)",
    foreground: "var(--foreground)",
    surface: "var(--surface)",
    surfaceRaised: "var(--surface-raised)",
    accent: "var(--accent)",
    accentHover: "var(--accent-hover)",
    textPrimary: "var(--text-primary)",
    textSecondary: "var(--text-secondary)",
    textMuted: "var(--text-muted)",
    border: "var(--border)",
  },
  fontSize: {
    xs: "var(--font-size-xs)",
    sm: "var(--font-size-sm)",
    base: "var(--font-size-base)",
    lg: "var(--font-size-lg)",
    xl: "var(--font-size-xl)",
    "2xl": "var(--font-size-2xl)",
    "3xl": "var(--font-size-3xl)",
    "4xl": "var(--font-size-4xl)",
    "5xl": "var(--font-size-5xl)",
  },
  leading: {
    tight: "var(--leading-tight)",
    normal: "var(--leading-normal)",
    relaxed: "var(--leading-relaxed)",
  },
  tracking: {
    tight: "var(--tracking-tight)",
  },
  spacing: {
    "1": "var(--spacing-1)",
    "2": "var(--spacing-2)",
    "3": "var(--spacing-3)",
    "4": "var(--spacing-4)",
    "6": "var(--spacing-6)",
    "8": "var(--spacing-8)",
    "10": "var(--spacing-10)",
    "12": "var(--spacing-12)",
    "16": "var(--spacing-16)",
    "20": "var(--spacing-20)",
    "24": "var(--spacing-24)",
  },
} as const;

export type Tokens = typeof tokens;
