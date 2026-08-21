"use client";

import { Component, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { FloppyDiskScene, MagazineScene, VinylRecordScene } from "@portfolio/features/three/scenes";
import { supportsWebGL } from "@portfolio/features/landing/visualSupport";
import type { SectionVisualKind } from "./sectionVisualStore";

type SectionVisualTargetProps = {
  kind: SectionVisualKind;
  className: string;
  height: number;
  frameClassName?: string;
};

type SceneBoundaryProps = {
  children: ReactNode;
};

type SceneBoundaryState = {
  failed: boolean;
};

class SceneBoundary extends Component<SceneBoundaryProps, SceneBoundaryState> {
  state: SceneBoundaryState = { failed: false };

  static getDerivedStateFromError(): SceneBoundaryState {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

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
  const [webglEnabled, setWebglEnabled] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      if (supportsWebGL()) {
        setWebglEnabled(true);
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

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
      data-visual-mode={webglEnabled ? "interactive" : "static"}
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
      {webglEnabled ? (
        <SceneBoundary>
          <div className="absolute inset-0">{scene}</div>
        </SceneBoundary>
      ) : null}
      <div className={`absolute inset-0 pointer-events-none ${frameClassName}`} />
    </div>
  );
}
