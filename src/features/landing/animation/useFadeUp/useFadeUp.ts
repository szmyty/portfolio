"use client";

import { useReducedMotion } from "framer-motion";

/**
 * Returns Framer Motion props for a fade-up entrance animation.
 *
 * Respects the user's reduced-motion preference: when motion is reduced,
 * the element is immediately visible with no positional shift.
 */
export function useFadeUp() {
  const shouldReduceMotion = useReducedMotion();

  const variants = shouldReduceMotion
    ? { initial: { opacity: 1, y: 0 }, animate: { opacity: 1, y: 0 } }
    : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 } };

  return { variants, shouldReduceMotion };
}
