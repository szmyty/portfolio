"use client";

import { useEffect, useId, useRef } from "react";
import {
  type SectionVisualKind,
  registerSectionVisualSlot,
  unregisterSectionVisualSlot,
  updateSectionVisualVisibility,
} from "./sectionVisualStore";

type SectionVisualTargetProps = {
  kind: SectionVisualKind;
  className: string;
  height: number;
};

export function SectionVisualTarget({
  kind,
  className,
  height,
}: SectionVisualTargetProps) {
  const slotId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSectionVisualSlot(slotId, kind, ref.current);

    return () => {
      unregisterSectionVisualSlot(slotId);
    };
  }, [kind, slotId]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        updateSectionVisualVisibility(
          slotId,
          entry.isIntersecting,
          entry.intersectionRatio,
        );
      },
      {
        rootMargin: "120px 0px 120px 0px",
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      },
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      updateSectionVisualVisibility(slotId, false, 0);
    };
  }, [slotId]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", height }}
    >
      <div className="absolute inset-0 rounded-2xl border border-border bg-surface-overlay" />
    </div>
  );
}
