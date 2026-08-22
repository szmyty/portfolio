"use client";

import { useEffect, useId } from "react";
import {
  registerSectionVisualSlot,
  unregisterSectionVisualSlot,
  type SectionVisualKind,
} from "./sectionVisualStore";
import { useVisualInView } from "./useVisualInView";

type SectionVisualTargetProps = {
  kind: SectionVisualKind;
  className: string;
  height: number;
  frameClassName?: string;
};

const FALLBACK_MARKS: Record<SectionVisualKind, string> = {
  floppy: "◇",
  magazine: "▤",
  vinyl: "○",
};

export function SectionVisualTarget({
  kind,
  className,
  height,
  frameClassName = "rounded-2xl border border-border bg-surface-overlay",
}: SectionVisualTargetProps) {
  const reactId = useId();
  const slotId = `section-visual-${kind}-${reactId}`;
  const { ref, isVisible } = useVisualInView();

  useEffect(() => {
    registerSectionVisualSlot(slotId, kind, isVisible ? ref.current : null);

    return () => unregisterSectionVisualSlot(slotId);
  }, [isVisible, kind, ref, slotId]);

  return (
    <div
      ref={ref}
      className={className}
      data-visual-kind={kind}
      data-visual-mode={isVisible ? "candidate" : "static"}
      style={{ position: "relative", height }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-2xl border border-border/40 bg-surface-overlay/30"
      >
        <span className="select-none text-7xl text-accent/25">
          {FALLBACK_MARKS[kind]}
        </span>
      </div>
      <div
        className={`absolute inset-0 pointer-events-none ${frameClassName}`}
      />
    </div>
  );
}
