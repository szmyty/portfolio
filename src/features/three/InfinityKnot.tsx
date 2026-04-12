"use client";

/**
 * InfinityKnot renders a torus-knot geometry configured with p=2, q=1
 * to approximate an infinity (lemniscate) shape.
 *
 * Parameters:
 *   - radius: overall size of the knot path
 *   - tube: thickness of the tube
 *   - tubularSegments: smoothness along the tube length
 *   - radialSegments: smoothness around the tube cross-section
 *   - p=2, q=1: winding numbers that produce the figure-eight / infinity form
 */
export function InfinityKnot() {
  return (
    <mesh>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 1]} />
      <meshStandardMaterial color="#6366f1" roughness={0.4} metalness={0.6} />
    </mesh>
  );
}
