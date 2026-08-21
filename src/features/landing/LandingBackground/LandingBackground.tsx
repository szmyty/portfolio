"use client";

import dynamic from "next/dynamic";
import { Component, useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useScrollParallax } from "@portfolio/lib/hooks/useScrollParallax";
import {
  supportsWebGL,
  VISUAL_READY_TIMEOUT_MS,
} from "@portfolio/features/landing/visualSupport";

const LandingVisualLayer = dynamic(
  () =>
    import("@portfolio/features/landing/animation/LandingVisualLayer").then(
      (mod) => mod.LandingVisualLayer,
    ),
  { ssr: false },
);

type LandingBackgroundProps = {
  onReady?: () => void;
};

type VisualMode = "static" | "loading" | "interactive";

type VisualErrorBoundaryProps = {
  children: ReactNode;
  onFallback: () => void;
};

type VisualErrorBoundaryState = {
  failed: boolean;
};

class VisualErrorBoundary extends Component<
  VisualErrorBoundaryProps,
  VisualErrorBoundaryState
> {
  state: VisualErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): VisualErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFallback();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
export function LandingBackground({ onReady }: LandingBackgroundProps) {
  const shouldReduceMotion = useReducedMotion();
  const [visualMode, setVisualMode] = useState<VisualMode>("static");
  const timeoutRef = useRef<number | null>(null);
  const resolvedVisualMode =
    shouldReduceMotion === true ? "static" : visualMode;

  // 3D scene drifts upward at a different rate than the background stars,
  // creating a layered depth effect between canvas and starfield.
  const { y: canvasY } = useScrollParallax({
    mode: "global",
    inputRange: [0, 900],
    outputRange: [0, -45],
  });

  const clearReadyTimeout = useCallback(() => {
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const useStaticFallback = useCallback(() => {
    clearReadyTimeout();
    setVisualMode("static");
  }, [clearReadyTimeout]);

  const handleReady = useCallback(() => {
    clearReadyTimeout();
    setVisualMode("interactive");
    onReady?.();
  }, [clearReadyTimeout, onReady]);

  useEffect(() => {
    if (shouldReduceMotion !== false || !supportsWebGL()) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setVisualMode("loading");
      timeoutRef.current = window.setTimeout(
        useStaticFallback,
        VISUAL_READY_TIMEOUT_MS,
      );
    });

    return () => {
      window.cancelAnimationFrame(frame);
      clearReadyTimeout();
    };
  }, [clearReadyTimeout, shouldReduceMotion, useStaticFallback]);

  return (
    <div
      aria-hidden="true"
      data-visual-mode={resolvedVisualMode}
      className="absolute inset-x-0 top-0 h-screen h-dvh z-0 overflow-hidden"
    >
      {resolvedVisualMode !== "static" ? (
        <VisualErrorBoundary onFallback={useStaticFallback}>
          <motion.div
            className={
              resolvedVisualMode === "interactive"
                ? "absolute inset-0 pointer-events-auto"
                : "absolute inset-0 pointer-events-none"
            }
            style={{ y: canvasY }}
            initial={false}
            animate={{ opacity: resolvedVisualMode === "interactive" ? 1 : 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <LandingVisualLayer onReady={handleReady} />
          </motion.div>
        </VisualErrorBoundary>
      ) : null}
    </div>
  );
}
