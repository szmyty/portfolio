"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

/**
 * BloomEffect adds a subtle luminous glow around emissive surfaces using the
 * Bloom pass from @react-three/postprocessing.
 *
 * Tuning notes:
 * - intensity: kept low (0.8) so the glow amplifies emissive without overexposure.
 * - luminanceThreshold: 0.2 captures the emissive torus-knot (emissiveIntensity 0.15–1.0)
 *   while ignoring low-luminance background elements.
 * - luminanceSmoothing: 0.9 softens the threshold edge for a natural bloom falloff.
 * - mipmapBlur: true uses mipmap-based blur for a higher quality, lower-cost spread.
 */
export function BloomEffect() {
  return (
    <EffectComposer>
      <Bloom
        intensity={0.8}
        luminanceThreshold={0.2}
        luminanceSmoothing={0.9}
        mipmapBlur
      />
    </EffectComposer>
  );
}
