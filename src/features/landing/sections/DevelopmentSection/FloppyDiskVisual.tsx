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
 * FloppyDiskVisual — persistent 3D visual for the Development section.
 */
export function FloppyDiskVisual() {
  return (
    <SectionVisualTarget
      kind="floppy"
      className="w-full max-w-[248px] sm:max-w-[280px] md:max-w-[312px]"
      frameClassName="rounded-2xl bg-transparent border border-transparent"
      height={300}
    />
  );
}

export function StandaloneFloppyDiskVisual() {
  return (
    <div
      className="w-full max-w-[248px] sm:max-w-[280px] md:max-w-[312px]"
      style={{ position: "relative", height: "300px" }}
    >
      <FloppyDiskScene />
    </div>
  );
}
