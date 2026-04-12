"use client";

import { Canvas } from "@react-three/fiber";
import { Infinity } from "../Infinity";
import { useTheme } from "@portfolio/lib/theme";

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
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      {/* Ambient — higher in light mode to lift the whole scene */}
      <ambientLight intensity={isLight ? 0.5 : 0.25} />
      {/* Key light from upper-left-front — reduced slightly in light mode */}
      <directionalLight position={[4, 6, 3]} intensity={isLight ? 0.8 : 1.0} />
      {/* Fill light from lower-right-back — softens shadows without killing depth */}
      <directionalLight position={[-4, -2, -3]} intensity={isLight ? 0.35 : 0.2} />
      {/* Rim light — warm lavender in dark, soft indigo in light */}
      <directionalLight
        position={[-3, 4, -5]}
        intensity={isLight ? 0.4 : 0.6}
        color={isLight ? "#a5b4fc" : "#818cf8"}
      />
      <Infinity />
    </Canvas>
  );
}
