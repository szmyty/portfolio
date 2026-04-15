"use client";

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";
import {
  FloppyDisk,
  Magazine,
  VinylRecord,
} from "@portfolio/features/three";
import {
  getSectionVisualSnapshot,
  subscribeSectionVisualStore,
  type SectionVisualKind,
} from "./sectionVisualStore";

type RectState = {
  left: number;
  top: number;
  width: number;
  height: number;
};

const CAMERA_CONFIG: Record<
  SectionVisualKind,
  { position: [number, number, number]; fov: number }
> = {
  vinyl: {
    position: [0, 0, 5],
    fov: 40,
  },
  magazine: {
    position: [0, 0, 6],
    fov: 40,
  },
  floppy: {
    position: [0, 0.1, 5],
    fov: 28,
  },
};

function CameraRig({ kind }: { kind: SectionVisualKind }) {
  const { camera } = useThree();
  const target = CAMERA_CONFIG[kind];

  useEffect(() => {
    camera.position.set(target.position[0], target.position[1], target.position[2]);
    if ("fov" in camera) {
      camera.fov = target.fov;
      camera.updateProjectionMatrix();
    }
    camera.lookAt(0, 0, 0);
  }, [camera, target]);

  return null;
}

function SectionVisualRig({ kind }: { kind: SectionVisualKind }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  if (kind === "vinyl") {
    return (
      <>
        <ambientLight intensity={isLight ? 0.52 : 0.72} />
        <directionalLight
          position={[3, 5, 4]}
          intensity={isLight ? 1.3 : 1.9}
          color={isLight ? "#ffffff" : "#ffe5f7"}
        />
        <directionalLight
          position={[-3, -2, -3]}
          intensity={isLight ? 0.42 : 0.62}
          color={isLight ? "#e7dcff" : "#c7f2ff"}
        />
        <directionalLight
          position={[4, 3, -5]}
          intensity={isLight ? 0.55 : 0.8}
          color={isLight ? "#e0d8f0" : "#c8c0dc"}
        />
        <pointLight
          position={[0, 0.25, 3.75]}
          intensity={isLight ? 0.55 : 0.9}
          color={isLight ? "#fff6fb" : "#ffd4fb"}
        />
        <VinylRecord />
      </>
    );
  }

  if (kind === "magazine") {
    return (
      <>
        <ambientLight intensity={isLight ? 0.7 : 0.9} />
        <directionalLight position={[3, 5, 4]} intensity={isLight ? 1.0 : 1.4} />
        <directionalLight position={[-3, -2, -3]} intensity={isLight ? 0.4 : 0.5} />
        <directionalLight
          position={[4, 3, -5]}
          intensity={isLight ? 0.5 : 0.6}
          color={isLight ? "#f0e8d8" : "#ddd0bc"}
        />
        <Magazine />
      </>
    );
  }

  return (
    <>
      <ambientLight intensity={isLight ? 0.95 : 0.6} />
      <directionalLight
        position={[4, 5, 4]}
        intensity={isLight ? 1.35 : 1.2}
        color={isLight ? "#ffffff" : "#ffd7f3"}
      />
      <directionalLight
        position={[-3, -2, -4]}
        intensity={isLight ? 0.45 : 0.38}
        color={isLight ? "#f0d8ff" : "#9fe7ff"}
      />
      <directionalLight
        position={[0, 2, -5]}
        intensity={isLight ? 0.42 : 0.48}
        color={isLight ? "#ffd5ea" : "#ff7fd7"}
      />
      <FloppyDisk />
    </>
  );
}

export function SharedSectionVisualCanvas() {
  const logger = useLifecycleLogger("SharedSectionVisualCanvas");
  const snapshot = useSyncExternalStore(
    subscribeSectionVisualStore,
    getSectionVisualSnapshot,
    getSectionVisualSnapshot,
  );
  const [rect, setRect] = useState<RectState | null>(null);
  const canvasKindRef = useRef<SectionVisualKind | null>(null);

  useEffect(() => {
    const activeElement = snapshot.activeElement;
    if (!activeElement) return;

    const updateRect = () => {
      const bounds = activeElement.getBoundingClientRect();
      setRect({
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      });
    };

    const frameId = window.requestAnimationFrame(updateRect);

    const resizeObserver = new ResizeObserver(updateRect);
    resizeObserver.observe(activeElement);

    window.addEventListener("scroll", updateRect, { passive: true });
    window.addEventListener("resize", updateRect);

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", updateRect);
      window.removeEventListener("resize", updateRect);
    };
  }, [snapshot.activeElement]);

  useEffect(() => {
    if (!snapshot.activeKind) return;

    canvasKindRef.current = snapshot.activeKind;
    logger.emit("active-visual-changed", {
      id: snapshot.activeId,
      kind: snapshot.activeKind,
    });
  }, [logger, snapshot.activeId, snapshot.activeKind]);

  const containerStyle = useMemo(() => {
    if (!rect) return { display: "none" } as const;

    return {
      position: "fixed" as const,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      zIndex: 15,
      pointerEvents: "none" as const,
    };
  }, [rect]);

  if (!snapshot.activeKind || !rect) {
    return null;
  }

  return (
    <div aria-hidden="true" style={containerStyle}>
      <div className="h-full w-full rounded-2xl overflow-hidden pointer-events-auto">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 40 }}
          style={{ width: "100%", height: "100%" }}
          dpr={[1, 1.25]}
          gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
          onCreated={({ gl }) => {
            canvasKindRef.current = snapshot.activeKind;
            logger.emit("canvas-created", {
              dpr: gl.getPixelRatio(),
              kind: snapshot.activeKind,
            });

            gl.domElement.addEventListener("webglcontextlost", () => {
              logger.emit("webgl-context-lost", {
                kind: canvasKindRef.current,
              });
            });

            gl.domElement.addEventListener("webglcontextrestored", () => {
              logger.emit("webgl-context-restored", {
                kind: canvasKindRef.current,
              });
            });
          }}
        >
          <CameraRig kind={snapshot.activeKind} />
          <SectionVisualRig kind={snapshot.activeKind} />
        </Canvas>
      </div>
    </div>
  );
}
