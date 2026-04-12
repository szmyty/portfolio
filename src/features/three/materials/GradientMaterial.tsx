"use client";

import { useCallback } from "react";
import type { MaterialProps } from "./types";

/**
 * GradientMaterial applies a smooth three-stop color gradient across the
 * infinity object surface:
 *
 *   bottom → blue   (#6366f1 indigo)
 *   mid    → purple (#a855f7)
 *   top    → cyan   (#06b6d4)
 *
 * The gradient is driven by each vertex's local y-position, injected into the
 * standard PBR shader via `onBeforeCompile`. This preserves the material type
 * as MeshStandardMaterial so the InfinityObject animation loop can still drive
 * `emissiveIntensity` through `matRef` without any interface changes.
 *
 * PBR settings match StandardMaterial so the swap is visually seamless:
 *   - roughness 0.3 — smooth surface reflects the emissive glow cleanly.
 *   - metalness 0.7 — amplifies light response and adds depth.
 *
 * Swap this component back for StandardMaterial — or forward to a full
 * ShaderMaterial — without touching any other layer.
 */
export function GradientMaterial({ matRef }: MaterialProps) {
  // Stable reference so R3F does not trigger a needsUpdate on every render.
  const onBeforeCompile = useCallback(
    (shader: { vertexShader: string; fragmentShader: string }) => {
      // Pass local y-position from vertex → fragment shader.
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
varying float vGradientY;`,
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vGradientY = position.y;`,
      );

      // Declare the varying and blend the three gradient stops.
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
varying float vGradientY;`,
      );
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
// Map local y (approx -1.3 to +1.3 for this torus-knot geometry) to [0, 1].
float t = clamp((vGradientY + 1.3) / 2.6, 0.0, 1.0);
// Three-stop gradient: blue (#6366f1) -> purple (#a855f7) -> cyan (#06b6d4).
vec3 colorA = vec3(0.388, 0.400, 0.945); // #6366f1 indigo / blue
vec3 colorB = vec3(0.659, 0.333, 0.969); // #a855f7 purple
vec3 colorC = vec3(0.024, 0.714, 0.831); // #06b6d4 cyan
vec3 gradientColor = t < 0.5
  ? mix(colorA, colorB, t * 2.0)
  : mix(colorB, colorC, (t - 0.5) * 2.0);
diffuseColor.rgb = gradientColor;`,
      );
    },
    [],
  );

  return (
    <meshStandardMaterial
      ref={matRef}
      roughness={0.3}
      metalness={0.7}
      emissive="#818cf8"
      emissiveIntensity={0}
      onBeforeCompile={onBeforeCompile}
    />
  );
}
