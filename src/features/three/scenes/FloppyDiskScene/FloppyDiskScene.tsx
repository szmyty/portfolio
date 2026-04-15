"use client";

import { Canvas } from "@react-three/fiber";
import { FloppyDisk } from "@portfolio/features/three/objects";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * FloppyDiskScene — Canvas wrapper for the OBJ-backed floppy disk visual.
 *
 * This mirrors the Magazine/Vinyl scene pattern so the Development section can
 * host its own distinct object while we iterate on materials and label mapping.
 */
export function FloppyDiskScene() {
  const logger = useLifecycleLogger("FloppyDiskScene");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0.1, 5], fov: 28 }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        logger.emit("canvas-created", {
          dpr: gl.getPixelRatio(),
          isLight,
        });

        gl.domElement.addEventListener("webglcontextlost", () => {
          logger.emit("webgl-context-lost");
        });

        gl.domElement.addEventListener("webglcontextrestored", () => {
          logger.emit("webgl-context-restored");
        });
      }}
    >
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
    </Canvas>
  );
}
