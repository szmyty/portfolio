"use client";

import { Canvas } from "@react-three/fiber";
import { FloppyDisk } from "@portfolio/features/three/objects";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * FloppyDiskScene — Canvas wrapper for the OBJ-backed floppy disk visual.
 *
 * Uses a multi-light rig to keep metallic/plastic highlights legible in both
 * light and dark themes.
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
      <ambientLight intensity={isLight ? 0.58 : 0.42} />
      <hemisphereLight
        intensity={isLight ? 0.5 : 0.45}
        color={isLight ? "#f7fbff" : "#b8caf8"}
        groundColor={isLight ? "#d7c7be" : "#1e2230"}
      />
      <directionalLight
        position={[3.2, 4.8, 5.2]}
        intensity={isLight ? 1.24 : 1.05}
        color={isLight ? "#ffffff" : "#ffdff0"}
      />
      <directionalLight
        position={[-3.5, -1.2, -3.8]}
        intensity={isLight ? 0.5 : 0.45}
        color={isLight ? "#e4efff" : "#9ecbff"}
      />
      <directionalLight
        position={[1.8, 1.8, -4.8]}
        intensity={isLight ? 0.46 : 0.54}
        color={isLight ? "#ffe1d0" : "#ffc3e7"}
      />
      <pointLight
        position={[0, 0.28, 4]}
        intensity={isLight ? 0.44 : 0.54}
        color={isLight ? "#fefcff" : "#ffd9f4"}
      />
      <FloppyDisk />
    </Canvas>
  );
}
