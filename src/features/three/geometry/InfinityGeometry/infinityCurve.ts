"use client";

import { Vector3 } from "three";

export const INFINITY_CURVE_WIDTH = 2.2;
export const INFINITY_CURVE_HEIGHT = 1.2;
export const INFINITY_CROSSOVER_DEPTH = 0.7;
export const INFINITY_CROSSOVER_FOCUS = 2.8;
export const INFINITY_TUBE_RADIUS = 0.23;
export const INFINITY_TUBULAR_SEGMENTS = 256;
export const INFINITY_RADIAL_SEGMENTS = 40;

/**
 * Samples the 3D infinity centerline used by the main mesh.
 *
 * The base silhouette is a Gerono lemniscate in XY, with a localized Z lift
 * near the waist so the crossover reads as an over/under pass.
 */
export function getInfinityPoint(t: number, target = new Vector3()) {
  const angle = t * Math.PI * 2;
  const sin = Math.sin(angle);
  const cos = Math.cos(angle);

  const x = sin * INFINITY_CURVE_WIDTH;
  const y = sin * cos * INFINITY_CURVE_HEIGHT;

  const distanceFromCenter = Math.hypot(
    x / INFINITY_CURVE_WIDTH,
    y / INFINITY_CURVE_HEIGHT,
  );

  const crossoverEnvelope = Math.exp(
    -INFINITY_CROSSOVER_FOCUS * distanceFromCenter * distanceFromCenter,
  );

  const z = cos * INFINITY_CROSSOVER_DEPTH * crossoverEnvelope;

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
