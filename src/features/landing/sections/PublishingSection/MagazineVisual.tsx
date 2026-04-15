"use client";

import { SectionVisualTarget } from "../shared/SectionVisualTarget";

/**
 * MagazineVisual — client component wrapper that lazy-loads the 3D magazine
 * canvas (WebGL requires the DOM so SSR must be disabled).
 *
 * The container uses `position: relative` (required by react-three-fiber Canvas)
 * and an explicit height so the WebGL context gets the correct dimensions.
 *
 * Width is constrained to stay within the Section visual column, while height
 * preserves the 2:3 portrait aspect ratio of the magazine geometry.
 */
export function MagazineVisual() {
  return (
    <SectionVisualTarget
      kind="magazine"
      className="w-full max-w-[240px] sm:max-w-[280px] md:max-w-[320px]"
      height={360}
    />
  );
}
