"use client";

import { Canvas } from "@react-three/fiber";
import { Magazine } from "@portfolio/features/three/objects";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * MagazineScene — Canvas wrapper for the interactive 3D magazine object.
 *
 * Renders inside the Publishing section's visual slot (right column).
 * Camera is positioned to frame a 2 × 3 portrait box comfortably.
 *
 * Lighting setup (soft three-point):
 * - ambientLight: warm neutral fill so the paper-coloured surface stays readable.
 * - key directionalLight: upper-left-front — rakes across the flat cover face
 *   and produces a soft gradient from highlight to shadow.
 * - fill directionalLight: lower-right-back — lifts the shadow side gently.
 * - rim directionalLight: upper-right-back — traces the thin spine silhouette
 *   and separates the object from the section background.
 *
 * Lighting intensities adapt to the active theme (light / dark).
 */
export function MagazineScene() {
  const logger = useLifecycleLogger("MagazineScene");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true }}
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
      {/* Warm ambient — substantially higher in dark mode so paper surface is legible */}
      <ambientLight intensity={isLight ? 0.7 : 0.9} />
      {/* Key light — upper-left-front */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={isLight ? 1.0 : 1.4}
      />
      {/* Fill light — lower-right-back */}
      <directionalLight
        position={[-3, -2, -3]}
        intensity={isLight ? 0.4 : 0.5}
      />
      {/* Rim light — traces the thin spine edge */}
      <directionalLight
        position={[4, 3, -5]}
        intensity={isLight ? 0.5 : 0.6}
        color={isLight ? "#f0e8d8" : "#ddd0bc"}
      />
      <Magazine />
    </Canvas>
  );
}
