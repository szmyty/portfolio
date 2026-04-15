"use client";

import { useRef } from "react";

/**
 * Motion hook tuned for the floppy disk visual.
 *
 * Compared with the magazine, the floppy should feel more rigid and archival:
 * - slower idle drift
 * - gentler drag sensitivity
 * - lighter inertia after release
 */
export function useFloppyDiskMotion() {
  const rotX = useRef(0);
  const rotY = useRef(0);

  const velX = useRef(0);
  const velY = useRef(0);

  const resetVelocity = () => {
    velX.current = 0;
    velY.current = 0;
  };

  const applyDrag = (dx: number, dy: number) => {
    const DRAG_SENSITIVITY = 0.0045;

    const dvy = dx * DRAG_SENSITIVITY;
    const dvx = dy * DRAG_SENSITIVITY;

    velX.current = dvx;
    velY.current = dvy;

    rotX.current += dvx;
    rotY.current += dvy;
  };

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

    const DAMPING = Math.pow(0.9, delta * 60);
    const IDLE_THRESHOLD = 0.00008;

    const hasInertia =
      Math.abs(velX.current) > IDLE_THRESHOLD ||
      Math.abs(velY.current) > IDLE_THRESHOLD;

    if (hasInertia) {
      velX.current *= DAMPING;
      velY.current *= DAMPING;

      rotX.current += velX.current;
      rotY.current += velY.current;
    } else if (!reducedMotion) {
      rotY.current += delta * 0.12;
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
