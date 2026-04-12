"use client";

import type { MaterialProps } from "./types";

/**
 * StandardMaterial is the baseline PBR material for InfinityObject.
 *
 * Color palette matches the portfolio indigo accent (#6366f1).
 * The emissive channel is driven externally through `matRef` so the
 * InfinityObject animation loop can lerp the glow intensity on every frame.
 *
 * Swap this component for a shader-based material in a future iteration
 * without modifying any other layer.
 */
export function StandardMaterial({ matRef }: MaterialProps) {
  return (
    <meshStandardMaterial
      ref={matRef}
      color="#6366f1"
      roughness={0.4}
      metalness={0.6}
      emissive="#6366f1"
      emissiveIntensity={0}
    />
  );
}
