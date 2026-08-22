export const INFINITY_CURVE_WIDTH: number;
export const INFINITY_CURVE_HEIGHT: number;
export const INFINITY_CROSSOVER_DEPTH: number;
export const INFINITY_CROSSOVER_FOCUS: number;
export const INFINITY_TUBE_RADIUS: number;
export const INFINITY_TUBULAR_SEGMENTS: number;
export const INFINITY_RADIAL_SEGMENTS: number;
export const INFINITY_SEAM_OFFSET: number;
export const INFINITY_HALO_RADIUS: number;
export const INFINITY_VISUAL_WIDTH: number;
export const INFINITY_PORTRAIT_FIT: number;
export const INFINITY_LANDSCAPE_FIT: number;
export const INFINITY_MAX_SCALE: number;
export function getInfinityCoordinates(
  t: number,
): readonly [number, number, number];
export function getInfinityVisualScale(
  viewportWidth: number,
  viewportHeight: number,
): number;
