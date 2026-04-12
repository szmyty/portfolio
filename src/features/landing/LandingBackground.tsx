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

export function LandingBackground() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-screen z-0 overflow-hidden"
    >
      {/* Hero-intensity cosmic atmosphere — stars and accent nebula glow */}
      <CosmicBackground mode="hero" />
      {/* Centered animation layer — lazy-loaded client-side to defer non-critical bundle */}
      <LandingVisualLayer />
    </div>
  );
}
