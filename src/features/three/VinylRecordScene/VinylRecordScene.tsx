"use client";

import { Canvas } from "@react-three/fiber";
import { VinylRecord } from "../VinylRecord";
import { useTheme } from "@portfolio/lib/theme";

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
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      style={{ width: "100%", height: "100%" }}
      gl={{ alpha: true }}
    >
      {/* Low ambient — keeps shadows visible on the dark disc */}
      <ambientLight intensity={isLight ? 0.4 : 0.5} />
      {/* Key light — upper-left-front, produces highlight arc on vinyl */}
      <directionalLight
        position={[3, 5, 4]}
        intensity={isLight ? 1.2 : 1.6}
      />
      {/* Fill light — lower-right-back */}
      <directionalLight
        position={[-3, -2, -3]}
        intensity={isLight ? 0.3 : 0.4}
      />
      {/* Rim light — traces the thin disc edge */}
      <directionalLight
        position={[4, 3, -5]}
        intensity={isLight ? 0.4 : 0.5}
        color={isLight ? "#e0d8f0" : "#c8c0dc"}
      />
      <VinylRecord />
    </Canvas>
  );
}
