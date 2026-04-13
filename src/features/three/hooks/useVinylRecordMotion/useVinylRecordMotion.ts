"use client";

import { useRef } from "react";

/**
 * Hook responsible for vinyl record object motion:
 * - rotation accumulation
 * - velocity tracking
 * - inertia / damping
 * - idle Z-axis spin (disc spinning on its face axis, like a turntable)
 *
 * The record disc faces the camera after a 90° X rotation applied in the
 * component, so the natural idle animation is a rotation around Z (the disc's
 * own central axis as seen from the viewer).
 */
export function useVinylRecordMotion() {
  /**
   * Rotation state (radians).
   * rotZ drives the idle turntable spin; rotX / rotY allow drag-tilt.
   */
  const rotX = useRef(0);
  const rotY = useRef(0);
  const rotZ = useRef(0);

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
   * Apply drag movement → tilt rotation + velocity
   *
   * dx / dy are pointer deltas in pixels.
   * Dragging tilts the record on its X / Y axes.
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
   * - inertia decay on X / Y tilt axes after drag release
   * - idle Z-axis turntable spin when at rest
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
       * Idle: spin the disc around its face axis (Z in the camera-facing
       * orientation) like a record on a turntable.
       */
      rotZ.current += delta * 0.4;
    }
  };

  return {
    rotX,
    rotY,
    rotZ,
    velX,
    velY,
    resetVelocity,
    applyDrag,
    updateMotion,
  };
}
