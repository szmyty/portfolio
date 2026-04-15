"use client";

import { Canvas } from "@react-three/fiber";
import { Infinity } from "../Infinity";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * Scene renders a Three.js canvas using React Three Fiber.
 *
 * Marked as a client component because WebGL requires access to the DOM.
 * Import this component via dynamic import with ssr: false to avoid
 * server-side rendering errors.
 *
 * Lighting setup (three-point + rim):
 * - ambientLight: reduced intensity so the metallic surface retains contrast;
 *   a too-high ambient flattens highlights and removes perceived depth.
 * - key directionalLight: primary light from upper-left-front, angled to rake
 *   across the torus-knot curves and produce sharp, intentional specular
 *   highlights on the metallic surface.
 * - fill directionalLight: low-intensity counter-light from lower-right-back
 *   to soften the shadow side without erasing depth contrast.
 * - rim directionalLight: backlight from upper-right-back with a cool violet
 *   tint that traces the silhouette edges of the knot, separating the object
 *   from the background and reinforcing its three-dimensional form.
 *
 * Post-processing bloom is enabled by default via the Infinity effects
 * prop and adds a soft luminous glow around emissive surfaces.
 *
 * Lighting values adapt to the active theme:
 *   - dark: high-contrast, deep shadow with vivid rim.
 *   - light: brighter ambient, softer key, warmer rim to suit the pale background.
 */
export function Scene() {
  const logger = useLifecycleLogger("HeroScene");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 50 }}
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
      {/* Ambient stays restrained so the shader-driven glow retains contrast. */}
      <ambientLight intensity={isLight ? 0.4 : 0.14} color={isLight ? "#e5eefb" : "#1d2340"} />
      {/* Cool key light shapes the top arc without flattening the shader colors. */}
      <directionalLight
        position={[4, 5, 3]}
        intensity={isLight ? 0.55 : 0.7}
        color={isLight ? "#c7d2fe" : "#9cc7ff"}
      />
      {/* Magenta fill keeps the underside from going dead-black in dark mode. */}
      <directionalLight
        position={[-5, -2, 2]}
        intensity={isLight ? 0.2 : 0.32}
        color={isLight ? "#d8b4fe" : "#d946ef"}
      />
      {/* Violet rim separates the silhouette from the background field. */}
      <directionalLight
        position={[-3, 4, -5]}
        intensity={isLight ? 0.3 : 0.5}
        color={isLight ? "#a5b4fc" : "#8b5cf6"}
      />
      {/* Soft front fill helps the crossover stay readable once the object is lowered. */}
      <pointLight
        position={[0, 0.5, 3.5]}
        intensity={isLight ? 0.18 : 0.24}
        color={isLight ? "#ffffff" : "#dff9ff"}
      />
      <Infinity
        position={[0, -0.95, 0]}
        effects={{ rotation: false }}
      />
    </Canvas>
  );
}
