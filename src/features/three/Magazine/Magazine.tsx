"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";

import { MagazineGeometry } from "../geometry/MagazineGeometry";
import { useInfinityInteraction } from "../hooks/useInfinityInteraction";
import { useMagazineMotion } from "../hooks/useMagazineMotion";

/**
 * Emissive intensity levels (subtle, matches a matte paper surface)
 */
const IDLE_EMISSIVE = 0.05;
const HOVER_EMISSIVE = 0.3;
const ENGAGED_EMISSIVE = 0.6;

/**
 * Magazine
 *
 * Interactive 3D magazine object with:
 * - portrait box geometry (2 × 3 × 0.06)
 * - slow Y-axis idle auto-rotation
 * - drag rotation (hold-to-engage, 250 ms threshold) on both axes
 * - inertia coast after release
 * - hover and engagement emissive feedback
 *
 * Geometry proportions match the ego-hygiene-edition-1 cover image.
 * Textures will be applied in a follow-up issue.
 */
export function Magazine() {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

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
   * Motion system (Y-axis idle rotation, drag, inertia)
   */
  const motion = useMagazineMotion();

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
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    const isEngaged = interaction.interactionState.current === "engaged";

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
     * Hover / engaged scale feedback.
     */
    const isHovered = interaction.isHovered.current;
    const targetNorm = isEngaged ? 1.06 : isHovered ? 1.03 : 1.0;
    const currentNorm = meshRef.current.scale.x;
    meshRef.current.scale.setScalar(
      currentNorm + (targetNorm - currentNorm) * Math.min(delta * 8, 1),
    );

    /**
     * Smooth emissive transitions
     */
    if (matRef.current) {
      const current = matRef.current.emissiveIntensity;
      matRef.current.emissiveIntensity =
        current +
        (emissiveTarget.current - current) * Math.min(delta * 6, 1);
    }
  });

  return (
    <>
      <mesh
        ref={meshRef}
        onPointerDown={interaction.handlePointerDown}
        onPointerEnter={interaction.handlePointerEnter}
        onPointerLeave={interaction.handlePointerLeave}
      >
        <MagazineGeometry />
        <meshStandardMaterial
          ref={matRef}
          color="#e8e0d0"
          roughness={0.6}
          metalness={0.1}
          emissive="#c8bfaf"
          emissiveIntensity={IDLE_EMISSIVE}
        />
      </mesh>
    </>
  );
}
