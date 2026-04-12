"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";
import { useScrollParallax } from "@portfolio/lib/hooks/useScrollParallax";

const LandingVisualLayer = dynamic(
  () =>
    import("@portfolio/features/landing/animation/LandingVisualLayer").then(
      (mod) => mod.LandingVisualLayer,
    ),
  { ssr: false },
);

/**
 * LandingBackground — layer 0 + layer 1 of the pointer-event stack.
 *
 * Pointer-event layering rules (see --z-* tokens in globals.css):
 *   • CosmicBackground  (layer 0 / background)  — pointer-events: none
 *     Purely decorative starfield; must never intercept input.
 *   • LandingVisualLayer (layer 1 / 3D canvas)   — pointer-events: auto
 *     WebGL scene; receives drag and hover input when the UI overlay
 *     above it passes events through (its container is pointer-events: none).
 *
 * The wrapping div uses the default pointer-events behavior (auto) so that
 * the canvas sub-layer remains reachable through the UI overlay above it.
 *
 * The 3D canvas layer has a subtle upward parallax as the user scrolls,
 * adding depth separation between the cosmic background and the 3D object.
 * Parallax is disabled when the user prefers reduced motion.
 */
export function LandingBackground() {
  // 3D scene drifts upward at a different rate than the background stars,
  // creating a layered depth effect between canvas and starfield.
  const { y: canvasY } = useScrollParallax({
    mode: "global",
    inputRange: [0, 900],
    outputRange: [0, -45],
  });

  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen h-dvh z-0 overflow-hidden"
    >
      {/* Layer 0 — background: non-interactive cosmic atmosphere */}
      <CosmicBackground mode="hero" />
      {/* Layer 1 — 3D canvas: interactive WebGL scene with scroll parallax.
           The motion.div occupies the full container (absolute inset-0) so that
           LandingVisualLayer's own absolute inset-0 positioning stays relative to
           this wrapper rather than the outer container, preserving its z-[1] stacking. */}
      <motion.div className="absolute inset-0" style={{ y: canvasY }}>
        <LandingVisualLayer />
      </motion.div>
    </div>
  );
}
