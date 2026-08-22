"use client";

import dynamic from "next/dynamic";
import {
  Component,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";
import type { PerspectiveCamera } from "three";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";
import { supportsWebGL } from "@portfolio/features/landing/visualSupport";
import {
  getSectionVisualSnapshot,
  notifySectionVisualLayoutChange,
  subscribeSectionVisualStore,
  type SectionVisualKind,
} from "./sectionVisualStore";

type RectState = {
  slotId: string;
  left: number;
  top: number;
  width: number;
  height: number;
};

type SectionCanvasBoundaryProps = {
  children: ReactNode;
  onFallback: () => void;
};

type SectionCanvasBoundaryState = {
  failed: boolean;
};

class SectionCanvasBoundary extends Component<
  SectionCanvasBoundaryProps,
  SectionCanvasBoundaryState
> {
  state: SectionCanvasBoundaryState = { failed: false };

  static getDerivedStateFromError(): SectionCanvasBoundaryState {
    return { failed: true };
  }

  componentDidCatch() {
    this.props.onFallback();
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}

const VinylRecord = dynamic(
  () =>
    import("@portfolio/features/three/objects/VinylRecord").then(
      (module) => module.VinylRecord,
    ),
  { ssr: false },
);

const Magazine = dynamic(
  () =>
    import("@portfolio/features/three/objects/Magazine").then(
      (module) => module.Magazine,
    ),
  { ssr: false },
);

const FloppyDisk = dynamic(
  () =>
    import("@portfolio/features/three/objects/FloppyDisk").then(
      (module) => module.FloppyDisk,
    ),
  { ssr: false },
);

const CAMERA_CONFIG: Record<
  SectionVisualKind,
  {
    fitWidth: number;
    fitHeight: number;
    fov: number;
    offsetX: number;
    offsetY: number;
    padding: number;
  }
> = {
  vinyl: {
    fitWidth: 4.2,
    fitHeight: 4.2,
    fov: 34,
    offsetX: 0,
    offsetY: 0.05,
    padding: 0.55,
  },
  magazine: {
    fitWidth: 2.4,
    fitHeight: 3.35,
    fov: 40,
    offsetX: 0,
    offsetY: 0,
    padding: 0.6,
  },
  floppy: {
    fitWidth: 4.9,
    fitHeight: 4.5,
    fov: 28,
    offsetX: 0,
    offsetY: 0.1,
    padding: 0.55,
  },
};

function CameraRig({ kind }: { kind: SectionVisualKind }) {
  const { camera, size } = useThree();
  const target = CAMERA_CONFIG[kind];

  useEffect(() => {
    const perspectiveCamera = camera as PerspectiveCamera;
    const aspect = Math.max(size.width / Math.max(size.height, 1), 0.1);
    const verticalFovRadians = (target.fov * Math.PI) / 180;
    const horizontalFovRadians =
      2 * Math.atan(Math.tan(verticalFovRadians / 2) * aspect);
    const verticalDistance =
      target.fitHeight / 2 / Math.tan(verticalFovRadians / 2);
    const horizontalDistance =
      target.fitWidth / 2 / Math.tan(horizontalFovRadians / 2);
    const distance =
      Math.max(verticalDistance, horizontalDistance) + target.padding;

    // eslint-disable-next-line react-hooks/immutability
    perspectiveCamera.fov = target.fov;
    perspectiveCamera.position.set(target.offsetX, target.offsetY, distance);
    perspectiveCamera.near = 0.1;
    perspectiveCamera.far = 100;
    perspectiveCamera.updateProjectionMatrix();
    camera.lookAt(0, 0, 0);
  }, [camera, size.height, size.width, target]);

  return null;
}

function SectionVisualRig({ kind }: { kind: SectionVisualKind }) {
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  switch (kind) {
    case "vinyl":
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
    case "magazine":
      return (
        <>
          <ambientLight intensity={isLight ? 0.7 : 0.9} />
          <directionalLight
            position={[3, 5, 4]}
            intensity={isLight ? 1.0 : 1.4}
          />
          <directionalLight
            position={[-3, -2, -3]}
            intensity={isLight ? 0.4 : 0.5}
          />
          <directionalLight
            position={[4, 3, -5]}
            intensity={isLight ? 0.5 : 0.6}
            color={isLight ? "#f0e8d8" : "#ddd0bc"}
          />
          <Magazine />
        </>
      );
    case "floppy":
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
    default:
      return null;
  }
}

export function SharedSectionVisualCanvas() {
  const logger = useLifecycleLogger("SharedSectionVisualCanvas");
  const shouldReduceMotion = useReducedMotion();
  const snapshot = useSyncExternalStore(
    subscribeSectionVisualStore,
    getSectionVisualSnapshot,
    getSectionVisualSnapshot,
  );
  const [rect, setRect] = useState<RectState | null>(null);
  const [webglSupported, setWebglSupported] = useState(false);
  const [failedSlotId, setFailedSlotId] = useState<string | null>(null);
  const canvasKindRef = useRef<SectionVisualKind>("vinyl");
  const activeSlotIdRef = useRef<string | null>(null);
  const removeContextListenersRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (shouldReduceMotion !== false) return;

    const frame = window.requestAnimationFrame(() => {
      setWebglSupported(supportsWebGL());
    });

    return () => window.cancelAnimationFrame(frame);
  }, [shouldReduceMotion]);

  useEffect(() => {
    return () => removeContextListenersRef.current?.();
  }, []);

  useEffect(() => {
    const activeElement = snapshot.activeElement;
    const activeSlotId = snapshot.activeId;
    if (!activeElement || !activeSlotId) return;

    const updateRect = () => {
      const bounds: DOMRect = activeElement.getBoundingClientRect();
      setRect((previousRect) => {
        const nextRect: RectState = {
          slotId: activeSlotId,
          left: bounds.left,
          top: bounds.top,
          width: bounds.width,
          height: bounds.height,
        };

        if (
          previousRect &&
          previousRect.slotId === nextRect.slotId &&
          previousRect.left === nextRect.left &&
          previousRect.top === nextRect.top &&
          previousRect.width === nextRect.width &&
          previousRect.height === nextRect.height
        ) {
          return previousRect;
        }

        return nextRect;
      });
    };

    let frameId: number | null = null;
    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(() => {
        frameId = null;
        updateRect();
        notifySectionVisualLayoutChange();
      });
    };

    scheduleUpdate();

    const resizeObserver = new ResizeObserver(scheduleUpdate);
    resizeObserver.observe(activeElement);

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
      resizeObserver.disconnect();
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [snapshot.activeElement, snapshot.activeId]);

  useEffect(() => {
    if (!snapshot.activeKind) return;

    canvasKindRef.current = snapshot.activeKind;
    activeSlotIdRef.current = snapshot.activeId;
    logger.emit("active-visual-changed", {
      id: snapshot.activeId,
      kind: snapshot.activeKind,
    });
  }, [logger, snapshot.activeId, snapshot.activeKind]);

  const currentKind: SectionVisualKind =
    snapshot.activeKind ?? snapshot.lastActiveKind;
  const shouldShowCanvas = !!(
    snapshot.activeKind &&
    snapshot.activeElement &&
    snapshot.activeId &&
    rect?.slotId === snapshot.activeId
  );
  const shouldMountCanvas =
    shouldShowCanvas &&
    webglSupported &&
    shouldReduceMotion === false &&
    failedSlotId !== snapshot.activeId;

  const containerStyle = useMemo(() => {
    if (!rect) {
      return {
        position: "fixed" as const,
        left: 0,
        top: 0,
        width: 0,
        height: 0,
        zIndex: 15,
        pointerEvents: "none" as const,
        opacity: 0,
        visibility: "hidden" as const,
      };
    }

    return {
      position: "fixed" as const,
      left: rect.left,
      top: rect.top,
      width: rect.width,
      height: rect.height,
      zIndex: 15,
      pointerEvents: "none" as const,
      opacity: shouldShowCanvas ? 1 : 0,
      visibility: shouldShowCanvas ? ("visible" as const) : ("hidden" as const),
    };
  }, [rect, shouldShowCanvas]);

  if (!shouldMountCanvas) return null;

  return (
    <SectionCanvasBoundary
      key={snapshot.activeId}
      onFallback={() => setFailedSlotId(activeSlotIdRef.current)}
    >
      <div
        aria-hidden="true"
        data-canvas-budget="shared-section-visual"
        data-visual-kind={currentKind}
        style={containerStyle}
      >
        <div className="h-full w-full pointer-events-auto">
          <Canvas
            camera={{ position: [0, 0, 5], fov: 40 }}
            style={{ width: "100%", height: "100%" }}
            dpr={[1, 1.25]}
            gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
            onCreated={({ gl }) => {
              canvasKindRef.current = currentKind;
              logger.emit("canvas-created", {
                dpr: gl.getPixelRatio(),
                kind: currentKind,
              });

              removeContextListenersRef.current?.();

              const handleContextLost = (event: Event) => {
                event.preventDefault();
                logger.emit("webgl-context-lost", {
                  kind: canvasKindRef.current,
                });
                setFailedSlotId(activeSlotIdRef.current);
              };

              const handleContextRestored = () => {
                logger.emit("webgl-context-restored", {
                  kind: canvasKindRef.current,
                });
                setFailedSlotId((current) =>
                  current === activeSlotIdRef.current ? null : current,
                );
              };

              gl.domElement.addEventListener(
                "webglcontextlost",
                handleContextLost,
              );
              gl.domElement.addEventListener(
                "webglcontextrestored",
                handleContextRestored,
              );

              removeContextListenersRef.current = () => {
                gl.domElement.removeEventListener(
                  "webglcontextlost",
                  handleContextLost,
                );
                gl.domElement.removeEventListener(
                  "webglcontextrestored",
                  handleContextRestored,
                );
              };
            }}
          >
            <CameraRig kind={currentKind} />
            <SectionVisualRig kind={currentKind} />
          </Canvas>
        </div>
      </div>
    </SectionCanvasBoundary>
  );
}
