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
 * - intensity: moderately strong so the infinity ribbon blooms into the starfield
 *   without dissolving into a white blob.
 * - luminanceThreshold: low enough to catch shader-driven emissive bands instead
 *   of only the brightest hotspots.
 * - luminanceSmoothing: softer threshold edge for a more atmospheric halo.
 * - mipmapBlur: true uses mipmap-based blur for a higher quality, lower-cost spread.
 */
export function BloomEffect({ enabled = true }: BloomEffectProps) {
  if (!enabled) return null;

  return (
    <EffectComposer>
      <Bloom
        intensity={1.1}
        luminanceThreshold={0.08}
        luminanceSmoothing={0.35}
        mipmapBlur
      />
    </EffectComposer>
  );
}
