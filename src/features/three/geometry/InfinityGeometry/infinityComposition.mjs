export const INFINITY_CURVE_WIDTH = 2.05;
export const INFINITY_CURVE_HEIGHT = 1.35;
export const INFINITY_CROSSOVER_DEPTH = 0.36;
export const INFINITY_CROSSOVER_FOCUS = 1.35;
export const INFINITY_TUBE_RADIUS = 0.19;
export const INFINITY_TUBULAR_SEGMENTS = 256;
export const INFINITY_RADIAL_SEGMENTS = 40;
export const INFINITY_SEAM_OFFSET = 0.25;
export const INFINITY_HALO_RADIUS = 0.35;
export const INFINITY_VISUAL_WIDTH =
  INFINITY_CURVE_WIDTH * 2 + (INFINITY_TUBE_RADIUS + INFINITY_HALO_RADIUS) * 2;
export const INFINITY_PORTRAIT_FIT = 0.72;
export const INFINITY_LANDSCAPE_FIT = 0.64;
export const INFINITY_MAX_SCALE = 0.68;

/** Returns the scalar XYZ centerline coordinates for a normalized path time. */
export function getInfinityCoordinates(t) {
  const angle = (t + INFINITY_SEAM_OFFSET) * Math.PI * 2;
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

  return [x, y, z];
}

export function getInfinityVisualScale(viewportWidth, viewportHeight) {
  const aspect = viewportWidth / Math.max(viewportHeight, 0.001);
  const fit = aspect < 0.8 ? INFINITY_PORTRAIT_FIT : INFINITY_LANDSCAPE_FIT;

  return Math.min(
    (viewportWidth * fit) / INFINITY_VISUAL_WIDTH,
    INFINITY_MAX_SCALE,
  );
}
