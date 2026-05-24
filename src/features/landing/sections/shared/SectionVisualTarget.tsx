"use client";

import { FloppyDiskScene, MagazineScene, VinylRecordScene } from "@portfolio/features/three/scenes";
import type { SectionVisualKind } from "./sectionVisualStore";

type SectionVisualTargetProps = {
  kind: SectionVisualKind;
  className: string;
  height: number;
  frameClassName?: string;
};

export function SectionVisualTarget({
  kind,
  className,
  height,
  frameClassName = "rounded-2xl border border-border bg-surface-overlay",
}: SectionVisualTargetProps) {
  const scene = (() => {
    switch (kind) {
      case "vinyl":
        return <VinylRecordScene />;
      case "magazine":
        return <MagazineScene />;
      case "floppy":
        return <FloppyDiskScene />;
      default:
        return null;
    }
  })();

  return (
    <div
      className={className}
      style={{ position: "relative", height }}
    >
      <div className="absolute inset-0">{scene}</div>
      <div className={`absolute inset-0 pointer-events-none ${frameClassName}`} />
    </div>
  );
}
