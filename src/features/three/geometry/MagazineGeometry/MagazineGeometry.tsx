"use client";

/**
 * MagazineGeometry
 *
 * Box geometry with proportions derived from the ego-hygiene-edition-1 cover:
 *   - width:  2   (portrait width)
 *   - height: 3   (portrait height — 3:2 ratio)
 *   - depth:  0.06 (thin magazine spine)
 *
 * Centred pivot so rotations feel natural around the object's core.
 */
export function MagazineGeometry() {
  return <boxGeometry args={[2, 3, 0.06]} />;
}
