"use client";

import { EffectComposer, Bloom } from "@react-three/postprocessing";

type BloomEffectProps = {
  /**
   * Whether the bloom post-processing effect is active.
   * Set to false to skip the EffectComposer entirely for performance savings.
   * Defaults to true.
   */
  enabled?: boolean;
};

/**
 * BloomEffect adds a subtle luminous glow around emissive surfaces using the
 * Bloom pass from @react-three/postprocessing.
 *
 * Pass `enabled={false}` to skip the EffectComposer entirely — useful for
 * reduced-motion mode, low-end devices, or debug panel toggles.
 *
 * Tuning notes:
 * - intensity: kept low (0.8) so the glow amplifies emissive without overexposure.
 * - luminanceThreshold: 0.2 captures the emissive torus-knot (emissiveIntensity 0.15–1.0)
 *   while ignoring low-luminance background elements.
 * - luminanceSmoothing: 0.9 softens the threshold edge for a natural bloom falloff.
 * - mipmapBlur: true uses mipmap-based blur for a higher quality, lower-cost spread.
 */
export function BloomEffect({ enabled = true }: BloomEffectProps) {
  if (!enabled) return null;

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
