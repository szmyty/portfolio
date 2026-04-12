"use client";

import { useRef } from "react";
import {
  type MotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";

/**
 * Options for useScrollParallax.
 *
 * @property mode        - "global"  → parallax driven by the page's scrollY position (px),
 *                         "element" → parallax driven by the element's scroll progress (0–1).
 * @property inputRange  - Scroll range to map over.
 *                         Global mode default: [0, 900] (pixels).
 *                         Element mode default: [0, 1] (progress fraction).
 * @property outputRange - Corresponding output values in pixels applied to the `y` transform.
 *                         Negative values move the element upward (typical parallax direction).
 */
export type UseScrollParallaxOptions = {
  mode?: "global" | "element";
  inputRange?: [number, number];
  outputRange: [number, number];
}

/**
 * useScrollParallax — a reusable scroll-driven parallax hook.
 *
 * Returns a `ref` to attach to the target element (required for "element" mode)
 * and a `y` MotionValue to pass to a `motion.*` style prop.
 *
 * Parallax is automatically disabled when the user prefers reduced motion.
 *
 * @example — global mode (hero/background layers)
 * ```tsx
 * const { y } = useScrollParallax({ outputRange: [0, -60] });
 * return <motion.div style={{ y }}>{...}</motion.div>;
 * ```
 *
 * @example — element mode (content sections)
 * ```tsx
 * const { ref, y } = useScrollParallax({ mode: "element", outputRange: [40, -40] });
 * return <div ref={ref}><motion.div style={{ y }}>{...}</motion.div></div>;
 * ```
 */
export function useScrollParallax({
  mode = "global",
  inputRange,
  outputRange,
}: UseScrollParallaxOptions): {
  ref: React.RefObject<HTMLDivElement | null>;
  y: MotionValue<number>;
} {
  const shouldReduceMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const safeOutput: [number, number] = shouldReduceMotion
    ? [0, 0]
    : outputRange;

  // React hooks must be called unconditionally, so both scroll sources are always
  // tracked. To minimise wasted computation, only the active mode's transform uses
  // the real outputRange; the inactive mode gets a no-op [0, 0] transform so its
  // MotionValue never influences layout.

  // Global mode — track the page's raw scroll position (pixels).
  const { scrollY } = useScroll();
  const globalInput = inputRange ?? [0, 900];
  const globalY = useTransform(
    scrollY,
    globalInput,
    mode === "global" ? safeOutput : [0, 0],
  );

  // Element mode — track this element's scroll progress through the viewport [0, 1].
  // Only forward the ref as target in element mode; passing an unattached ref in
  // global mode causes Framer Motion to throw "Target ref is defined but not hydrated".
  const { scrollYProgress } = useScroll({
    target: mode === "element" ? ref : undefined,
    offset: ["start end", "end start"],
  });
  const elementInput = inputRange ?? [0, 1];
  const elementY = useTransform(
    scrollYProgress,
    elementInput,
    mode === "element" ? safeOutput : [0, 0],
  );

  const y = mode === "global" ? globalY : elementY;

  return { ref, y };
}
