"use client";

import type { Ref } from "react";
import type { MeshStandardMaterial } from "three";

type VinylRecordMaterialProps = {
  matRef?: Ref<MeshStandardMaterial>;
};

/**
 * VinylRecordMaterial
 *
 * Baseline PBR material for the vinyl record disc surface.
 *
 * Color palette: near-black base (#1a1a1a) with a dark warm emissive channel
 * (#2a2020) to produce a subtle reddish sheen on the dark surface.
 *
 * The emissive channel intensity is driven externally through `matRef` so the
 * VinylRecord animation loop can lerp the glow on every frame:
 *   - idle     → barely-there ambient sheen (IDLE_EMISSIVE)
 *   - hover    → brightened presence (HOVER_EMISSIVE)
 *   - engaged  → full luminous highlight (ENGAGED_EMISSIVE)
 *
 * PBR settings:
 *   - roughness 0.3 — smooth enough to catch directional highlights across the
 *     flat disc face without looking plastic.
 *   - metalness 0.2 — slight metallic quality adds depth on the dark surface.
 *
 * Swap this component for a textured or shader-based material in a future
 * iteration without modifying any other layer.
 */
export function VinylRecordMaterial({ matRef }: VinylRecordMaterialProps) {
  return (
    <meshStandardMaterial
      ref={matRef}
      color="#1a1a1a"
      roughness={0.3}
      metalness={0.2}
      emissive="#2a2020"
      emissiveIntensity={0}
    />
  );
}

