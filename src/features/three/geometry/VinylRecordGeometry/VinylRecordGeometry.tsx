"use client";

/**
 * VinylRecordGeometry
 *
 * Cylinder geometry sized to a standard 12-inch vinyl record:
 *   - radiusTop:    1.5  (matches realistic disc proportions at scene scale)
 *   - radiusBottom: 1.5  (uniform — no taper)
 *   - height:       0.05 (thin disc, realistic vinyl thickness)
 *   - radialSegments: 128 (high count for a smooth, circular silhouette)
 *
 * Centred pivot so rotations feel natural around the disc's core.
 */
export function VinylRecordGeometry() {
  return <cylinderGeometry args={[1.5, 1.5, 0.05, 128]} />;
}
