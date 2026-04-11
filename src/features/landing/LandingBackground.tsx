"use client";

import dynamic from "next/dynamic";
import { tokens } from "@portfolio/lib/tokens";

const LandingVisualLayer = dynamic(
  () =>
    import("./animation/LandingVisualLayer").then(
      (mod) => mod.LandingVisualLayer,
    ),
  { ssr: false },
);

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
    >
      {/* Subtle radial gradient for depth — faint accent glow at center */}
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse 70% 60% at 50% 45%, color-mix(in srgb, ${tokens.color.accent} 6%, transparent) 0%, transparent 75%)`,
        }}
      />
      {/* Centered animation layer — lazy-loaded client-side to defer non-critical bundle */}
      <LandingVisualLayer />
    </div>
  );
}
