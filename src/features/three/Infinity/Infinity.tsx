"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { ComponentType, ReactNode } from "react";
import type { Mesh, MeshStandardMaterial } from "three";

import { InfinityGeometry } from "../geometry/InfinityGeometry";
import { GradientMaterial } from "../materials";
import { BloomEffect, ParticleTrail } from "../effects";

import { useInfinityInteraction } from "../hooks/useInfinityInteraction";
import { useInfinityMotion } from "../hooks/useInfinityMotion";
import type { InfinityProps } from "./Infinity.types";
import { isDev } from "@portfolio/config";
import { setDebugInteraction } from "@portfolio/lib/debug/debugStore";

/**
 * Emissive intensity levels
 */
const IDLE_EMISSIVE = 0.15;
const HOVER_EMISSIVE = 0.6;
const ENGAGED_EMISSIVE = 1.0;

/**
 * Geometry constants for viewport-aware scaling.
 * The lemniscate (InfinityGeometry) spans ~4.9 world units wide at scale=1,
 * derived from its horizontalScale (2.2) plus tube radius (0.25) on each side.
 */
const INFINITY_NATURAL_WIDTH = 4.9;
const INFINITY_MAX_SCALE = 0.7;

/**
 * Infinity
 *
 * Interactive lemniscate geometry with:
 * - drag rotation (hold-to-engage, 250 ms threshold)
 * - inertia coast after release
 * - idle auto-rotation fallback
 * - hover glow and scale feedback
 * - viewport-aware responsive scaling
 */
export function Infinity({
  GeometryComponent = InfinityGeometry,
  MaterialComponent = GradientMaterial,
  effects = { glow: true, particles: true },
}: InfinityProps) {
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
   * Motion system (rotation, velocity, inertia, idle fallback)
   */
  const motion = useInfinityMotion();

  /**
   * Interaction (hold-to-engage, hover feedback, window-level drag/release)
   */
  const interaction = useInfinityInteraction({
    canvasRef,
    emissiveTargetRef: emissiveTarget,
    IDLE_EMISSIVE,
    HOVER_EMISSIVE,
    ENGAGED_EMISSIVE,
    onPointerDownStart: motion.resetVelocity,
    onDrag: motion.applyDrag,
  });

  /**
   * Frame loop
   */
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const isEngaged = interaction.interactionState.current === "engaged";

    /**
     * Motion update: inertia coast → idle auto-rotation fallback.
     * Skipped while dragging (useInfinityMotion handles that via applyDrag).
     */
    motion.updateMotion({
      delta,
      isEngaged,
      reducedMotion: reducedMotion.current,
    });

    /**
     * Apply accumulated rotation to the mesh.
     */
    meshRef.current.rotation.x = motion.rotX.current;
    meshRef.current.rotation.y = motion.rotY.current;

    /**
     * Centered hero position
     */
    meshRef.current.position.x = 0;
    meshRef.current.position.y = 0;

    /**
     * Viewport-aware base scale.
     *
     * The lemniscate geometry spans ~4.9 world units wide at scale=1.
     * We fit the object within 85% of the visible viewport width so it
     * renders correctly on portrait mobile without clipping, while capping
     * the scale at 0.7 on larger viewports to preserve the intended size.
     */
    const { viewport } = state;
    const baseScale = Math.min(
      (viewport.width * 0.85) / INFINITY_NATURAL_WIDTH,
      INFINITY_MAX_SCALE,
    );

    /**
     * Scale interaction: idle → hovered → engaged.
     */
    const isHovered = interaction.isHovered.current;
    const targetNorm = isEngaged ? 1.08 : isHovered ? 1.04 : 1.0;
    const currentNorm = meshRef.current.scale.x / baseScale;
    const newNorm =
      currentNorm + (targetNorm - currentNorm) * Math.min(delta * 8, 1);
    meshRef.current.scale.setScalar(baseScale * newNorm);

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

    /**
     * Publish interaction state to debug store (dev only, no-op in prod).
     */
    if (isDev) {
      setDebugInteraction({
        interactionState: interaction.interactionState.current,
        isHovered: interaction.isHovered.current,
      });
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
      {effects.particles !== false && <ParticleTrail meshRef={meshRef} />}
    </>
  );
}
