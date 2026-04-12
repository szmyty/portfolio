"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { tokens } from "@portfolio/lib/tokens";
import { useTheme } from "@portfolio/lib/theme";

export type CosmicBackgroundMode = "hero" | "content";

interface CosmicBackgroundProps {
  mode?: CosmicBackgroundMode;
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

  // Hero mode: parallax driven by global scroll (stars drift as hero scrolls away)
  const { scrollY } = useScroll();
  const heroY1 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -60]);
  const heroY2 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -100]);
  const heroY3 = useTransform(scrollY, [0, 900], shouldReduceMotion ? [0, 0] : [0, -150]);

  // Content mode: parallax driven by section's scroll progress through the viewport
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const contentY1 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [40, -40]);
  const contentY2 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [65, -65]);
  const contentY3 = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [90, -90]);

  // Select the appropriate parallax values based on mode
  const y1 = isHero ? heroY1 : contentY1;
  const y2 = isHero ? heroY2 : contentY2;
  const y3 = isHero ? heroY3 : contentY3;

  // Star color adapts to theme: white on dark, soft dark on light
  const starColor1 = isLight ? "rgba(30,30,60,0.5)" : "rgba(255,255,255,0.9)";
  const starColor2 = isLight ? "rgba(30,30,60,0.4)" : "rgba(255,255,255,0.7)";
  const starColor3 = isLight ? "rgba(30,30,60,0.45)" : "rgba(255,255,255,0.8)";

  // Nebula glow adapts to theme: accent in dark, soft blue-grey in light
  const nebulaColor = isLight
    ? `color-mix(in srgb, ${tokens.color.accent} 12%, transparent)`
    : `color-mix(in srgb, ${tokens.color.accent} 8%, transparent)`;

  // Opacity values per layer per mode — extracted for readability
  const opacity1 = isHero ? (isLight ? 0.4 : 0.3) : (isLight ? 0.15 : 0.12);
  const opacity2 = isHero ? (isLight ? 0.35 : 0.25) : (isLight ? 0.12 : 0.1);
  const opacity3 = isHero ? (isLight ? 0.3 : 0.2) : (isLight ? 0.1 : 0.08);
  const overlayBackground = isLight ? "rgba(245,245,245,0.55)" : "rgba(0,0,0,0.55)";

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Background fill — picks up the theme's --background CSS variable */}
      <div className="absolute inset-0 bg-background" />

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
