"use client";

/**
 * TorusKnotGeometry renders a torus-knot geometry configured with p=2, q=1
 * to approximate an infinity (lemniscate) shape.
 *
 * Parameters:
 *   - radius (1): overall size of the knot path
 *   - tube (0.3): thickness of the tube
 *   - tubularSegments (128): smoothness along the tube length
 *   - radialSegments (16): smoothness around the tube cross-section
 *   - p=2, q=1: winding numbers that produce the figure-eight / infinity form
 *
 * Swap this component for a custom infinity-curve geometry in a future iteration
 * without touching any other layer.
 */
export function TorusKnotGeometry() {
  return <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 1]} />;
}
