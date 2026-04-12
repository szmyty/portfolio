"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { ComponentType, ReactNode } from "react";
import type { Mesh, MeshStandardMaterial } from "three";

import { InfinityGeometry } from "./geometry/InfinityGeometry";
import { GradientMaterial } from "./materials";
import { BloomEffect } from "./effects";

import { useInfinityInteraction } from "./hooks/useInfinityInteraction";

/**
 * Emissive intensity levels
 */
const IDLE_EMISSIVE = 0.15;
const HOVER_EMISSIVE = 0.6;
const ENGAGED_EMISSIVE = 1.0;

export type InfinityObjectProps = {
  GeometryComponent?: ComponentType;
  MaterialComponent?: ComponentType<{ matRef?: React.Ref<MeshStandardMaterial> }>;
  effects?: { glow?: boolean };
  children?: ReactNode;
};

/**
 * InfinityObject (Stable Edition)
 *
 * This version intentionally removes:
 * - rotation
 * - inertia
 * - drag physics
 * - floating animation
 *
 * The object is now:
 * → visually alive (shader + glow)
 * → spatially stable (anchored identity element)
 */
export function InfinityObject({
  GeometryComponent = InfinityGeometry,
  MaterialComponent = GradientMaterial,
  effects = { glow: true },
}: InfinityObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  /**
   * Shared refs
   */
  const emissiveTarget = useRef(IDLE_EMISSIVE);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { gl } = useThree();

  /**
   * Reduced motion preference
   */
  const reducedMotion = useRef(false);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  /**
   * Interaction (hover only now — no drag physics)
   */
  const interaction = useInfinityInteraction({
    canvasRef,
    emissiveTargetRef: emissiveTarget,
    IDLE_EMISSIVE,
    HOVER_EMISSIVE,
    ENGAGED_EMISSIVE,
  });

  /**
   * Frame loop (visual polish only)
   */
  useFrame(({ viewport }, delta) => {
    if (!meshRef.current) return;

    /**
     * Responsive positioning
     */
    const isLandscape = viewport.width >= viewport.height;

    const baseX = isLandscape
      ? viewport.width * 0.28
      : viewport.width * 0.08;

    const baseY = isLandscape
      ? viewport.height * -0.18
      : viewport.height * -0.32;

    meshRef.current.position.x = baseX;
    meshRef.current.position.y = baseY;

    /**
     * Subtle scale interaction (feels premium, not distracting)
     */
    const isHovered = interaction.isHovered.current;

    const targetScale = isHovered ? 1.04 : 1.0;

    const currentNorm = meshRef.current.scale.x / 0.7;

    const newNorm =
      currentNorm + (targetScale - currentNorm) * Math.min(delta * 6, 1);

    meshRef.current.scale.setScalar(0.7 * newNorm);

    /**
     * Smooth emissive transitions
     */
    if (matRef.current) {
      const current = matRef.current.emissiveIntensity;

      matRef.current.emissiveIntensity =
        current +
        (emissiveTarget.current - current) *
          Math.min(delta * 6, 1);
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        scale={0.7}
        onPointerDown={interaction.handlePointerDown}
        onPointerEnter={interaction.handlePointerEnter}
        onPointerLeave={interaction.handlePointerLeave}
      >
        <GeometryComponent />
        <MaterialComponent matRef={matRef} />
      </mesh>

      {effects.glow !== false && <BloomEffect />}
    </>
  );
}