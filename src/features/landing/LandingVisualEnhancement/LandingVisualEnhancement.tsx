"use client";

import dynamic from "next/dynamic";
import { Component } from "react";
import type { ReactNode } from "react";

const LandingBackground = dynamic(
  () =>
    import("@portfolio/features/landing/LandingBackground").then(
      (mod) => mod.LandingBackground,
    ),
  { ssr: false },
);

type EnhancementBoundaryProps = {
  children: ReactNode;
};

type EnhancementBoundaryState = {
  failed: boolean;
};

class EnhancementBoundary extends Component<
  EnhancementBoundaryProps,
  EnhancementBoundaryState
> {
  state: EnhancementBoundaryState = { failed: false };

  static getDerivedStateFromError(): EnhancementBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

/**
 * Client-only bridge for the optional WebGL layer.
 *
 * The server-rendered page owns the complete content and CSS background. A
 * failed dynamic import therefore leaves a usable static portfolio rather than
 * replacing the homepage with an error or loading gate.
 */
export function LandingVisualEnhancement() {
  return (
    <EnhancementBoundary>
      <LandingBackground />
    </EnhancementBoundary>
  );
}
