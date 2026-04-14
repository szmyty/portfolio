"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { AdditiveBlending, BufferAttribute, Color, DynamicDrawUsage, Vector3 } from "three";
import type { Mesh, Points } from "three";
import { getInfinityPoint } from "../../geometry/InfinityGeometry/infinityCurve";

const DEFAULT_COUNT = 220;

type ParticleTrailProps = {
  meshRef: React.RefObject<Mesh | null>;
  count?: number;
}

type ParticleField = {
  anchors: Float32Array;
  positions: Float32Array;
  colors: Float32Array;
  drift: Float32Array;
  seeds: Float32Array;
}

function createParticleField(count: number): ParticleField {
  const anchors = new Float32Array(count * 3);
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const drift = new Float32Array(count * 3);
  const seeds = new Float32Array(count);

  const point = new Vector3();
  const outward = new Vector3();
  const driftDir = new Vector3();
  const color = new Color();

  for (let i = 0; i < count; i++) {
    const t = i / count;
    getInfinityPoint(t, point);

    outward.set(point.x, point.y * 0.9, point.z * 0.35);
    if (outward.lengthSq() < 1e-4) {
      outward.set(0, 1, 0);
    } else {
      outward.normalize();
    }

    driftDir.set(
      outward.x + (Math.random() - 0.5) * 0.45,
      outward.y + (Math.random() - 0.5) * 0.45,
      outward.z + (Math.random() - 0.5) * 0.25,
    ).normalize();

    const haloRadius = 0.1 + Math.random() * 0.18;
    const shimmerRadius = 0.035 + Math.random() * 0.07;

    anchors[i * 3] = point.x + outward.x * haloRadius;
    anchors[i * 3 + 1] = point.y + outward.y * haloRadius;
    anchors[i * 3 + 2] = point.z + outward.z * (haloRadius * 0.35);

    positions[i * 3] = anchors[i * 3];
    positions[i * 3 + 1] = anchors[i * 3 + 1];
    positions[i * 3 + 2] = anchors[i * 3 + 2];

    drift[i * 3] = driftDir.x * shimmerRadius;
    drift[i * 3 + 1] = driftDir.y * shimmerRadius;
    drift[i * 3 + 2] = driftDir.z * shimmerRadius;

    seeds[i] = Math.random() * Math.PI * 2;

    color
      .setStyle(
        Math.random() > 0.5
          ? "rgb(140,245,255)"
          : Math.random() > 0.5
            ? "rgb(255,160,255)"
            : "rgb(255,255,255)",
      )
      .multiplyScalar(0.8 + Math.random() * 0.45);

    colors[i * 3] = color.r;
    colors[i * 3 + 1] = color.g;
    colors[i * 3 + 2] = color.b;
  }

  return { anchors, positions, colors, drift, seeds };
}

/**
 * ParticleTrail now acts as a sparse halo field rather than a literal trail.
 *
 * The reference image reads as ionized dust peeling off the ribbon edges, so
 * these points hover just outside the infinity loops and shimmer subtly instead
 * of marching visibly along the centerline.
 */
export function ParticleTrail({
  meshRef,
  count = DEFAULT_COUNT,
}: ParticleTrailProps) {
  const pointsRef = useRef<Points>(null);
  const posAttrRef = useRef<BufferAttribute>(null);

  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  const field = useMemo(() => createParticleField(count), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !meshRef.current || !posAttrRef.current) return;

    if (!reducedMotion.current) {
      const time = state.clock.getElapsedTime();
      const posAttr = posAttrRef.current;

      for (let i = 0; i < count; i++) {
        const pulse = Math.sin(time * 0.85 + field.seeds[i]) * 0.5 + 0.5;
        const driftScale = 0.45 + pulse * 0.55;

        posAttr.setXYZ(
          i,
          field.anchors[i * 3] + field.drift[i * 3] * driftScale,
          field.anchors[i * 3 + 1] + field.drift[i * 3 + 1] * driftScale,
          field.anchors[i * 3 + 2] + field.drift[i * 3 + 2] * driftScale,
        );
      }

      posAttr.needsUpdate = true;
    }

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
          args={[field.positions, 3]}
          usage={DynamicDrawUsage}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[field.colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.038}
        sizeAttenuation
        transparent
        opacity={0.7}
        blending={AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}
