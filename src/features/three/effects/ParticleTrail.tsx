"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, DynamicDrawUsage } from "three";
import type { Points, Mesh, BufferAttribute } from "three";

/**
 * Lemniscate scaling constants — must match InfinityGeometry / InfinityCurve.
 *
 *   angle ∈ [0, 2π]
 *   denom = 1 + sin²(angle)
 *   x = cos(angle) / denom · HORIZONTAL_SCALE
 *   y = sin(angle)·cos(angle) / denom · VERTICAL_SCALE
 *   z = 0
 */
const HORIZONTAL_SCALE = 2.2;
const VERTICAL_SCALE = 1.2;

/**
 * Number of pre-computed path samples used for position interpolation.
 * Higher = smoother particle motion along tightly-curved sections.
 */
const PATH_SAMPLES = 512;

/** Default number of particles spread evenly around the path. */
const DEFAULT_COUNT = 80;

/**
 * Default travel speed in path-fractions per second.
 * 0.12 means the trail completes one full loop every ~8 seconds.
 */
const DEFAULT_SPEED = 0.12;

interface ParticleTrailProps {
  /** Ref to the main mesh whose transform the trail mirrors each frame. */
  meshRef: React.RefObject<Mesh | null>;
  /** Number of particles spread along the path. Defaults to 80. */
  count?: number;
  /** Travel speed in path-fractions per second. Defaults to 0.12. */
  speed?: number;
}

/**
 * Pre-computed lemniscate (infinity) centerline — calculated once at module load.
 *
 * Uses the same Bernoulli lemniscate formula as InfinityGeometry / InfinityCurve
 * so particles ride exactly on the geometry spine:
 *
 *   angle = t · 2π,  t ∈ [0, 1)
 *   denom = 1 + sin²(angle)
 *   x = cos(angle) / denom · HORIZONTAL_SCALE
 *   y = sin(angle)·cos(angle) / denom · VERTICAL_SCALE
 *   z = 0
 *
 * Storing as a module-level constant avoids re-computing inside the component
 * render cycle and keeps it outside React's hooks immutability rules.
 */
const INFINITY_PATH: Float32Array = (() => {
  const arr = new Float32Array(PATH_SAMPLES * 3);
  for (let i = 0; i < PATH_SAMPLES; i++) {
    const angle = (i / PATH_SAMPLES) * Math.PI * 2;
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);
    const denom = 1 + sin * sin;
    arr[i * 3] = (cos / denom) * HORIZONTAL_SCALE;
    arr[i * 3 + 1] = ((sin * cos) / denom) * VERTICAL_SCALE;
    arr[i * 3 + 2] = 0;
  }
  return arr;
})();

/**
 * ParticleTrail renders a stream of glowing particles that travel along the
 * lemniscate (infinity) spine — the same centerline used by InfinityGeometry.
 *
 * Implementation notes:
 * - INFINITY_PATH is a module-level pre-computed array (512 equally-spaced
 *   points) using the Bernoulli lemniscate formula, so particles ride the
 *   geometry centerline precisely.
 * - Particles are spread evenly around the full loop and advance at the same
 *   rate, keeping density uniform throughout the animation.
 * - Additive blending makes overlapping particles accumulate brightness,
 *   naturally reinforcing the Bloom post-processing glow on the same layer.
 * - The points transform is copied from the mesh ref each frame so the trail
 *   stays in perfect lockstep with all rotations, floats, and scale pulses.
 */
export function ParticleTrail({
  meshRef,
  count = DEFAULT_COUNT,
  speed = DEFAULT_SPEED,
}: ParticleTrailProps) {
  const pointsRef = useRef<Points>(null);
  const posAttrRef = useRef<BufferAttribute>(null);
  const offsetRef = useRef(0);

  // Lazily-initialized starting positions passed to the bufferAttribute.
  // R3F reads this once on mount; from then on we drive updates imperatively
  // via posAttrRef.current inside useFrame.
  const [initialPositions] = useState<Float32Array>(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const idx = Math.min(Math.floor(t * PATH_SAMPLES), PATH_SAMPLES - 1);
      arr[i * 3] = INFINITY_PATH[idx * 3];
      arr[i * 3 + 1] = INFINITY_PATH[idx * 3 + 1];
      arr[i * 3 + 2] = INFINITY_PATH[idx * 3 + 2];
    }
    return arr;
  });

  useFrame((_, delta) => {
    if (!pointsRef.current || !meshRef.current || !posAttrRef.current) return;

    const posAttr = posAttrRef.current;

    // Advance the shared offset — wraps at 1.0 for a seamless loop.
    offsetRef.current = (offsetRef.current + speed * delta) % 1.0;

    // Recompute each particle's position by sampling the pre-computed path.
    for (let i = 0; i < count; i++) {
      const t = ((i / count) + offsetRef.current) % 1.0;
      const idx = Math.min(Math.floor(t * PATH_SAMPLES), PATH_SAMPLES - 1);
      posAttr.setXYZ(
        i,
        INFINITY_PATH[idx * 3],
        INFINITY_PATH[idx * 3 + 1],
        INFINITY_PATH[idx * 3 + 2],
      );
    }
    posAttr.needsUpdate = true;

    // Mirror the mesh transform so the trail rotates and floats in lockstep.
    pointsRef.current.rotation.copy(meshRef.current.rotation);
    pointsRef.current.position.copy(meshRef.current.position);
    pointsRef.current.scale.copy(meshRef.current.scale);
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttrRef}
          attach="attributes-position"
          args={[initialPositions, 3]}
          usage={DynamicDrawUsage}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#818cf8"
        size={0.05}
        sizeAttenuation
        transparent
        opacity={0.85}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
