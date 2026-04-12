"use client";

import { useCallback, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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
 * Animated flow: a `uTime` uniform advances each frame (via `useFrame`) and
 * drives three overlapping sine waves computed from local vertex position.
 * The resulting flow mask brightens the surface with a cyan-white energy
 * streak that travels continuously without flickering — matching the "energy
 * movement" design intent.
 *
 * PBR settings match StandardMaterial so the swap is visually seamless:
 *   - roughness 0.3 — smooth surface reflects the emissive glow cleanly.
 *   - metalness 0.7 — amplifies light response and adds depth.
 *
 * Swap this component back for StandardMaterial — or forward to a full
 * ShaderMaterial — without touching any other layer.
 */
export function GradientMaterial({ matRef }: MaterialProps) {
  // Holds the compiled shader's uniforms so useFrame can write uTime each
  // frame without triggering a re-compile.
  const uniformsRef = useRef<{ uTime: { value: number } } | null>(null);

  // Stable reference so R3F does not trigger a needsUpdate on every render.
  const onBeforeCompile = useCallback(
    (shader: {
      vertexShader: string;
      fragmentShader: string;
      uniforms: Record<string, { value: unknown }>;
    }) => {
      // Register the time uniform and share its object with useFrame.
      shader.uniforms.uTime = { value: 0 };
      uniformsRef.current = shader.uniforms as { uTime: { value: number } };

      // Pass local position from vertex → fragment shader.
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `#include <common>
varying float vGradientY;
varying vec3 vLocalPos;`,
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
vGradientY = position.y;
vLocalPos = position;`,
      );

      // Declare varyings and the time uniform in the fragment shader.
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <common>",
        `#include <common>
uniform float uTime;
varying float vGradientY;
varying vec3 vLocalPos;`,
      );

      // Replace the color fragment with gradient + animated energy flow.
      shader.fragmentShader = shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
// --- Gradient ---
// Map local y (approx -1.3 to +1.3 for this torus-knot geometry) to [0, 1].
float t = clamp((vGradientY + 1.3) / 2.6, 0.0, 1.0);
// Three-stop gradient: blue (#6366f1) -> purple (#a855f7) -> cyan (#06b6d4).
vec3 colorA = vec3(0.388, 0.400, 0.945); // #6366f1 indigo / blue
vec3 colorB = vec3(0.659, 0.333, 0.969); // #a855f7 purple
vec3 colorC = vec3(0.024, 0.714, 0.831); // #06b6d4 cyan
vec3 gradientColor = t < 0.5
  ? mix(colorA, colorB, t * 2.0)
  : mix(colorB, colorC, (t - 0.5) * 2.0);

// --- Animated energy flow ---
// Three overlapping sine waves at different frequencies and speeds create
// an organic, continuously flowing energy pattern across the surface.
float wave1 = sin(vLocalPos.x * 4.0 + vLocalPos.y * 2.0 + uTime * 1.2);
float wave2 = sin(vLocalPos.y * 3.0 - vLocalPos.z * 2.0 - uTime * 0.9);
float wave3 = cos(vLocalPos.z * 5.0 + vLocalPos.x * 1.5 + uTime * 1.6);
float flow = (wave1 + wave2 + wave3) / 3.0; // range: [-1, 1]

// Concentrate the energy highlight in the positive wave peaks (> 0.4).
float flowMask = smoothstep(0.4, 1.0, flow);

// Bright cyan-white streak color that reads as luminous energy.
vec3 energyColor = vec3(0.55, 0.85, 1.0);
diffuseColor.rgb = mix(gradientColor, energyColor, flowMask * 0.45);`,
      );
    },
    [],
  );

  // Advance the time uniform every frame so the energy flow animates.
  useFrame(({ clock }) => {
    if (uniformsRef.current) {
      uniformsRef.current.uTime.value = clock.getElapsedTime();
    }
  });

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
