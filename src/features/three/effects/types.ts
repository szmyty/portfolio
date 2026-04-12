/**
 * Hook-point types for the effect layer of InfinityObject.
 */
export interface EffectLayerProps {
  /**
   * Enable a bloom / glow post-processing pass around the mesh.
   * Implemented via @react-three/postprocessing EffectComposer + Bloom.
   * Defaults to true.
   */
  glow?: boolean;

  /**
   * Enable a particle-trail effect that animates glowing points along the
   * torus-knot spine, reinforcing the infinity-loop motion.
   * Defaults to true.
   */
  particles?: boolean;
}
