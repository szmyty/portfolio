"use client";

import { useRef } from "react";

/**
 * Hook responsible for magazine object motion:
 * - rotation accumulation
 * - velocity tracking
 * - inertia / damping
 * - idle Y-axis-only rotation fallback
 *
 * Derived from useInfinityMotion but with a Y-axis-only idle rotation so the
 * magazine spins slowly like a portrait object rather than tumbling on both axes.
 */
export function useMagazineMotion() {
  /**
   * Rotation state (radians)
   */
  const rotX = useRef(0);
  const rotY = useRef(0);

  /**
   * Velocity state (applied after drag release for inertia coast)
   */
  const velX = useRef(0);
  const velY = useRef(0);

  /**
   * Reset velocity when a new drag begins
   */
  const resetVelocity = () => {
    velX.current = 0;
    velY.current = 0;
  };

  /**
   * Apply drag movement → rotation + velocity
   *
   * dx / dy are pointer deltas in pixels
   */
  const applyDrag = (dx: number, dy: number) => {
    const DRAG_SENSITIVITY = 0.006;

    const dvy = dx * DRAG_SENSITIVITY;
    const dvx = dy * DRAG_SENSITIVITY;

    velX.current = dvx;
    velY.current = dvy;

    rotX.current += dvx;
    rotY.current += dvy;
  };

  /**
   * Per-frame update
   *
   * Handles:
   * - inertia decay (both axes — natural feel after drag)
   * - idle Y-axis-only rotation fallback
   */
  const updateMotion = ({
    delta,
    isEngaged,
    reducedMotion,
  }: {
    delta: number;
    isEngaged: boolean;
    reducedMotion: boolean;
  }) => {
    if (isEngaged) return;

    /**
     * Frame-rate independent damping
     */
    const DAMPING = Math.pow(0.92, delta * 60);

    /**
     * Below this → considered stopped
     */
    const IDLE_THRESHOLD = 0.0001;

    const hasInertia =
      Math.abs(velX.current) > IDLE_THRESHOLD ||
      Math.abs(velY.current) > IDLE_THRESHOLD;

    if (hasInertia) {
      velX.current *= DAMPING;
      velY.current *= DAMPING;

      rotX.current += velX.current;
      rotY.current += velY.current;
    } else if (!reducedMotion) {
      /**
       * Idle: Y-axis rotation only.
       * Magazines spin on their vertical axis — no tumbling.
       */
      rotY.current += delta * 0.3;
    }
  };

  return {
    rotX,
    rotY,
    velX,
    velY,
    resetVelocity,
    applyDrag,
    updateMotion,
  };
}
