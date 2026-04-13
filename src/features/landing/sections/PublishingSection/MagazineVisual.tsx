"use client";

import dynamic from "next/dynamic";

const MagazineScene = dynamic(
  () =>
    import("@portfolio/features/three/MagazineScene").then(
      (mod) => mod.MagazineScene,
    ),
  { ssr: false },
);

/**
 * MagazineVisual — client component wrapper that lazy-loads the 3D magazine
 * canvas (WebGL requires the DOM so SSR must be disabled).
 *
 * Sized to maintain the 2:3 portrait aspect ratio of the magazine geometry
 * while respecting the Section visual column width constraints.
 */
export function MagazineVisual() {
  return (
    <div className="w-full aspect-[2/3] max-w-[220px] sm:max-w-[260px] md:max-w-[300px]">
      <MagazineScene />
    </div>
  );
}
