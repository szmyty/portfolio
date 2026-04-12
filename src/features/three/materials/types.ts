import type { RefObject } from "react";
import type { MeshStandardMaterial } from "three";

/**
 * Shared props contract for all material components used inside InfinityObject.
 *
 * Every material component must accept a `matRef` so the animation loop in
 * InfinityObject can drive per-frame properties (e.g. emissive intensity)
 * without knowing which material is currently active.
 */
export type MaterialProps = {
  matRef: RefObject<MeshStandardMaterial | null>;
}

export type ExtendedShader = {
  vertexShader: string;
  fragmentShader: string;
  uniforms: Record<string, { value: unknown }>;
}
