import type { MutableRefObject } from "react";
import type { MeshStandardMaterial } from "three";

/**
 * Shared props contract for all material components used inside InfinityObject.
 *
 * Every material component must accept a `matRef` so the animation loop in
 * InfinityObject can drive per-frame properties (e.g. emissive intensity)
 * without knowing which material is currently active.
 */
export interface MaterialProps {
  matRef: MutableRefObject<MeshStandardMaterial | null>;
}
