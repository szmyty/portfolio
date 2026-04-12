"use client";

import dynamic from "next/dynamic";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";

const LandingVisualLayer = dynamic(
  () =>
    import("./animation/LandingVisualLayer").then(
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
 */
export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen z-0 overflow-hidden"
    >
      {/* Layer 0 — background: non-interactive cosmic atmosphere */}
      <CosmicBackground mode="hero" />
      {/* Layer 1 — 3D canvas: interactive WebGL scene */}
      <LandingVisualLayer />
    </div>
  );
}
