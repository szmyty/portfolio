"use client";

import dynamic from "next/dynamic";
import { SectionVisualTarget } from "../shared/SectionVisualTarget";

const FloppyDiskScene = dynamic(
  () =>
    import("@portfolio/features/three/scenes").then(
      (mod) => mod.FloppyDiskScene,
    ),
  { ssr: false },
);

/**
 * FloppyDiskVisual — lazy-loaded 3D visual for the Development section.
 */
export function FloppyDiskVisual() {
  return (
    <SectionVisualTarget
      kind="floppy"
      className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[340px]"
      height={320}
    />
  );
}

export function StandaloneFloppyDiskVisual() {
  return (
    <div
      className="w-full max-w-[280px] sm:max-w-[300px] md:max-w-[340px]"
      style={{ position: "relative", height: "320px" }}
    >
      <FloppyDiskScene />
    </div>
  );
}
