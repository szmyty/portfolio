"use client";

import { SectionVisualTarget } from "../shared/SectionVisualTarget";

/**
 * VinylVisual — client component wrapper that lazy-loads the 3D vinyl record
 * canvas (WebGL requires the DOM so SSR must be disabled).
 *
 * The container uses `position: relative` (required by react-three-fiber Canvas)
 * and an explicit height so the WebGL context gets the correct dimensions.
 *
 * A square aspect ratio is used to frame the circular disc naturally.
 */
export function VinylVisual() {
  return (
    <SectionVisualTarget
      kind="vinyl"
      className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[320px]"
      height={320}
    />
  );
}
