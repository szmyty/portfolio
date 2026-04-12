"use client";

import type { MaterialProps } from "../types";

/**
 * StandardMaterial is the baseline PBR material for InfinityObject.
 *
 * Color palette: blue-purple base (#6366f1 indigo) with a blue-violet emissive
 * channel (#818cf8) to produce a luminous glow across the blue → purple → cyan
 * tonal range.
 *
 * The emissive channel intensity is driven externally through `matRef` so the
 * InfinityObject animation loop can lerp the glow on every frame:
 *   - idle    → subtle ambient glow (IDLE_EMISSIVE)
 *   - hover   → brightened presence (HOVER_EMISSIVE)
 *   - engaged → full luminous highlight (ENGAGED_EMISSIVE)
 *
 * PBR settings:
 *   - roughness 0.3 — smoother surface reflects the emissive glow more cleanly.
 *   - metalness 0.7 — higher metallicity amplifies the light response and adds
 *     depth without washing out the emissive channel.
 *
 * Swap this component for a shader-based material in a future iteration
 * without modifying any other layer.
 */
export function StandardMaterial({ matRef }: MaterialProps) {
  return (
    <meshStandardMaterial
      ref={matRef}
      color="#6366f1"
      roughness={0.3}
      metalness={0.7}
      emissive="#818cf8"
      emissiveIntensity={0}
    />
  );
}
