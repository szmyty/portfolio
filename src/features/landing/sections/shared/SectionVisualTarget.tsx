"use client";

import { useEffect, useId, useRef } from "react";
import {
  notifySectionVisualLayoutChange,
  type SectionVisualKind,
  registerSectionVisualSlot,
  unregisterSectionVisualSlot,
} from "./sectionVisualStore";

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
  const slotId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerSectionVisualSlot(slotId, kind, ref.current);
    notifySectionVisualLayoutChange();

    return () => {
      unregisterSectionVisualSlot(slotId);
    };
  }, [kind, slotId]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const resizeObserver = new ResizeObserver(() => {
      notifySectionVisualLayoutChange();
    });
    resizeObserver.observe(node);

    const frameId = window.requestAnimationFrame(() => {
      notifySectionVisualLayoutChange();
    });

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    };
  }, [slotId]);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", height }}
    >
      <div className={`absolute inset-0 ${frameClassName}`} />
    </div>
  );
}
