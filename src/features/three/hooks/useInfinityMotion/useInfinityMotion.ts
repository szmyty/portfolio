"use client";

import { useRef } from "react";

/**
 * Internal motion state for the infinity object.
 *
 * This is completely independent from React rendering.
 * It behaves more like a mini physics system.
 */
export type InfinityMotionState = {
  rotX: { current: number };
  rotY: { current: number };
  velX: { current: number };
  velY: { current: number };
};

/**
 * Hook responsible for:
 * - rotation accumulation
 * - velocity tracking
 * - inertia / damping
 * - idle motion fallback
 */
export function useInfinityMotion() {
  /**
   * Rotation state (radians)
   */
  const rotX = useRef(0);
  const rotY = useRef(0);

  /**
   * Velocity state (applied after drag release)
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
    // Tune this for sensitivity (VERY important feel lever)
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
   * - inertia decay
   * - idle rotation fallback
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
       * Idle motion (subtle continuous rotation)
       */
      rotX.current += delta * 0.15;
      rotY.current += delta * 0.25;
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