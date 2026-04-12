/**
 * Hook-point types for the effect layer of InfinityObject.
 *
 * Effects are not yet implemented; this interface defines the intended
 * extension surface so the composition API remains stable when glow,
 * particle trails, and emissive effects are added in follow-up issues.
 */
export interface EffectLayerProps {
  /**
   * Enable a bloom / glow post-processing pass around the mesh.
   * Requires an UnrealBloomPass or @react-three/postprocessing Bloom effect.
   * (future — not yet implemented)
   */
  glow?: boolean;

  /**
   * Enable a particle-trail effect that follows the mesh surface.
   * (future — not yet implemented)
   */
  particles?: boolean;
}
