"use client";

import { Vector3 } from "three";
import { getInfinityCoordinates } from "./infinityComposition.mjs";

export {
  getInfinityVisualScale,
  INFINITY_CROSSOVER_DEPTH,
  INFINITY_CROSSOVER_FOCUS,
  INFINITY_CURVE_HEIGHT,
  INFINITY_CURVE_WIDTH,
  INFINITY_HALO_RADIUS,
  INFINITY_LANDSCAPE_FIT,
  INFINITY_MAX_SCALE,
  INFINITY_PORTRAIT_FIT,
  INFINITY_RADIAL_SEGMENTS,
  INFINITY_SEAM_OFFSET,
  INFINITY_TUBE_RADIUS,
  INFINITY_TUBULAR_SEGMENTS,
  INFINITY_VISUAL_WIDTH,
} from "./infinityComposition.mjs";

/**
 * Samples the 3D infinity centerline used by the main mesh.
 *
 * The base silhouette is a Gerono lemniscate in XY, with a broad, shallow Z
 * lift near the waist so the crossover reads as an over/under pass without a
 * sharp surface fold. The parameter seam lives at the outer-right extremum,
 * away from the visually sensitive crossover.
 */
export function getInfinityPoint(t: number, target = new Vector3()) {
  const [x, y, z] = getInfinityCoordinates(t);

  return target.set(x, y, z);
}

export function sampleInfinityPath(samples: number) {
  const positions = new Float32Array(samples * 3);
  const point = new Vector3();

  for (let i = 0; i < samples; i++) {
    getInfinityPoint(i / samples, point);
    positions[i * 3] = point.x;
    positions[i * 3 + 1] = point.y;
    positions[i * 3 + 2] = point.z;
  }

  return positions;
}
