import { tokens } from "@portfolio/lib/tokens";

export type CosmicBackgroundMode = "hero" | "content";

interface CosmicBackgroundProps {
  mode?: CosmicBackgroundMode;
}

/**
 * Layered cosmic background with adaptive intensity.
 *
 * Renders a static, CSS-only space atmosphere behind section content.
 * Supports two intensity modes:
 *   - "hero"    — full-intensity starfield and accent glow for high-impact sections
 *   - "content" — reduced starfield and stronger readability overlay for text-heavy sections
 *
 * Must be placed inside a `position: relative` container. All layers are
 * absolutely positioned and non-interactive (pointer-events-none).
 */
export function CosmicBackground({ mode = "hero" }: CosmicBackgroundProps) {
  const isHero = mode === "hero";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Starfield — layer 1: dense tiny stars */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
          backgroundSize: "120px 120px",
          opacity: isHero ? 0.3 : 0.12,
        }}
      />

      {/* Starfield — layer 2: offset tiny stars to break the grid pattern */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "170px 170px",
          backgroundPosition: "55px 90px",
          opacity: isHero ? 0.25 : 0.1,
        }}
      />

      {/* Starfield — layer 3: sparse medium stars */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.8) 1.5px, transparent 1.5px)",
          backgroundSize: "280px 280px",
          backgroundPosition: "140px 40px",
          opacity: isHero ? 0.2 : 0.08,
        }}
      />

      {/* Accent nebula glow — faint radial bloom from the accent color */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, color-mix(in srgb, ${tokens.color.accent} 8%, transparent) 0%, transparent 75%)`,
          opacity: isHero ? 1 : 0.45,
        }}
      />

      {/* Readability overlay — reduces visual noise in content sections so text stays legible */}
      {!isHero && (
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0, 0, 0, 0.55)" }}
        />
      )}
    </div>
  );
}
