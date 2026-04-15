"use client";

import { Canvas } from "@react-three/fiber";
import { VinylRecord } from "@portfolio/features/three/objects";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * VinylRecordScene — Canvas wrapper for the interactive 3D vinyl record object.
 *
 * Renders inside the Music section's visual slot (right column).
 * Camera is positioned to frame the 1.5-radius disc (diameter 3) comfortably.
 *
 * Lighting setup (adapted for a dark, semi-reflective vinyl surface):
 * - ambientLight: low fill — keeps shadows dramatic on the dark disc.
 * - key directionalLight: upper-left-front — rakes across the flat face and
 *   produces a highlight arc on the shiny vinyl surface.
 * - fill directionalLight: lower-right-back — lifts the shadow side gently.
 * - rim directionalLight: upper-right-back — traces the thin disc edge and
 *   separates the object from the section background.
 *
 * Lighting intensities adapt to the active theme (light / dark).
 */
export function VinylRecordScene() {
  const logger = useLifecycleLogger("VinylRecordScene");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
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
      {/* Higher ambient and a brighter front fill keep the imported model legible in dark mode. */}
      <ambientLight intensity={isLight ? 0.52 : 0.72} />
      {/* Key light — upper-left-front, produces highlight arc on vinyl */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={isLight ? 1.3 : 1.9}
        color={isLight ? "#ffffff" : "#ffe5f7"}
      />
      {/* Fill light — lower-right-back */}
      <directionalLight
        position={[-3, -2, -3]}
        intensity={isLight ? 0.42 : 0.62}
        color={isLight ? "#e7dcff" : "#c7f2ff"}
      />
      {/* Rim light — traces the thin disc edge */}
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
    </Canvas>
  );
}
