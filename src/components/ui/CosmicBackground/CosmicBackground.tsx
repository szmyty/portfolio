"use client";

import { useRef, type RefObject } from "react";
import { type MotionValue, motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tokens } from "@portfolio/lib/tokens";
import { useTheme } from "@portfolio/lib/theme";
import type { CosmicBackgroundMode, CosmicBackgroundProps } from "./CosmicBackground.types";

// Opacity values per starfield layer keyed by mode and theme palette.
const OPACITY = {
  layer1: { hero: { dark: 0.3, light: 0.4 }, content: { dark: 0.12, light: 0.15 } },
  layer2: { hero: { dark: 0.25, light: 0.35 }, content: { dark: 0.1, light: 0.12 } },
  layer3: { hero: { dark: 0.2, light: 0.3 }, content: { dark: 0.08, light: 0.1 } },
} as const;

type StarLayersProps = {
  y1: MotionValue<number>;
  y2: MotionValue<number>;
  y3: MotionValue<number>;
  opacity1: number;
  opacity2: number;
  opacity3: number;
  isLight: boolean;
};

/**
 * Three parallax starfield divs shared by both scroll modes.
 * Accepts pre-computed y motion values and opacity/color inputs to remain
 * decoupled from any scroll subscription logic.
 */
function StarLayers({ y1, y2, y3, opacity1, opacity2, opacity3, isLight }: StarLayersProps) {
  const starColor1 = isLight ? "rgba(30,30,60,0.5)" : "rgba(255,255,255,0.9)";
  const starColor2 = isLight ? "rgba(30,30,60,0.4)" : "rgba(255,255,255,0.7)";
  const starColor3 = isLight ? "rgba(30,30,60,0.45)" : "rgba(255,255,255,0.8)";

  return (
    <>
      {/* Starfield — layer 1: dense tiny stars (near depth — fastest parallax) */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${starColor1} 1px, transparent 1px)`,
          backgroundSize: "120px 120px",
          opacity: opacity1,
          y: y1,
        }}
      />

      {/* Starfield — layer 2: offset tiny stars (mid depth) */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${starColor2} 1px, transparent 1px)`,
          backgroundSize: "170px 170px",
          backgroundPosition: "55px 90px",
          opacity: opacity2,
          y: y2,
        }}
      />

      {/* Starfield — layer 3: sparse medium stars (far depth — slowest parallax) */}
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(${starColor3} 1.5px, transparent 1.5px)`,
          backgroundSize: "280px 280px",
          backgroundPosition: "140px 40px",
          opacity: opacity3,
          y: y3,
        }}
      />
    </>
  );
}

/**
 * Star layers driven by the global window scroll position (hero mode).
 * Only mounted when mode="hero", ensuring no element-scroll observer is attached.
 */
function HeroStarLayers({
  shouldReduceMotion,
  isLight,
}: {
  shouldReduceMotion: boolean | null;
  isLight: boolean;
}) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -60]);
  const y2 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -100]);
  const y3 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -150]);

  const palette = isLight ? "light" : "dark";
  return (
    <StarLayers
      y1={y1}
      y2={y2}
      y3={y3}
      opacity1={OPACITY.layer1.hero[palette]}
      opacity2={OPACITY.layer2.hero[palette]}
      opacity3={OPACITY.layer3.hero[palette]}
      isLight={isLight}
    />
  );
}

/**
 * Star layers driven by the element's scroll progress through the viewport (content mode).
 * Only mounted when mode="content", ensuring no global scroll listener is attached.
 */
function ContentStarLayers({
  containerRef,
  shouldReduceMotion,
  isLight,
}: {
  containerRef: RefObject<HTMLDivElement | null>;
  shouldReduceMotion: boolean | null;
  isLight: boolean;
}) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const y1 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [65, -65]);
  const y3 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [90, -90]);

  const palette = isLight ? "light" : "dark";
  return (
    <StarLayers
      y1={y1}
      y2={y2}
      y3={y3}
      opacity1={OPACITY.layer1.content[palette]}
      opacity2={OPACITY.layer2.content[palette]}
      opacity3={OPACITY.layer3.content[palette]}
      isLight={isLight}
    />
  );
}

/**
 * Layered cosmic background with adaptive intensity and scroll-based parallax.
 *
 * Renders a space atmosphere behind section content. Each starfield layer moves
 * at a different speed as the user scrolls, creating a sense of depth.
 *
 * Supports two intensity modes:
 *   - "hero"    — full-intensity starfield driven by global scroll position
 *   - "content" — reduced starfield driven by section-relative scroll progress
 *
 * Only one scroll subscription is active at a time: hero mode attaches a global
 * window scroll listener; content mode attaches an IntersectionObserver on the
 * container element. This prevents duplicate listeners from running simultaneously.
 *
 * Parallax is automatically disabled when the user prefers reduced motion.
 * Must be placed inside a `position: relative` container. All layers are
 * absolutely positioned and non-interactive (pointer-events-none).
 *
 * Starfield colors adapt to the active theme (dark: white dots, light: dark dots).
 */
export function CosmicBackground({ mode = "hero" }: CosmicBackgroundProps) {
  const isHero = mode === "hero";
  const shouldReduceMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  // Nebula glow adapts to theme: accent in dark, soft blue-grey in light
  const nebulaColor = isLight
    ? `color-mix(in srgb, ${tokens.color.accent} 12%, transparent)`
    : `color-mix(in srgb, ${tokens.color.accent} 8%, transparent)`;

  const overlayBackground = isLight ? "rgba(245,245,245,0.55)" : "rgba(0,0,0,0.55)";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Background fill — picks up the theme's --background CSS variable */}
      <div className="absolute inset-0 bg-background" />

      {/* Starfield parallax — only one scroll source is active at a time */}
      {isHero ? (
        <HeroStarLayers shouldReduceMotion={shouldReduceMotion} isLight={isLight} />
      ) : (
        <ContentStarLayers
          containerRef={containerRef}
          shouldReduceMotion={shouldReduceMotion}
          isLight={isLight}
        />
      )}

      {/* Accent nebula glow — static atmosphere, no parallax */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${nebulaColor} 0%, transparent 75%)`,
          opacity: isHero ? 1 : 0.45,
        }}
      />

      {/* Readability overlay — reduces visual noise in content sections so text stays legible */}
      {!isHero && (
        <div
          className="absolute inset-0"
          style={{ background: overlayBackground }}
        />
      )}
    </div>
  );
}
