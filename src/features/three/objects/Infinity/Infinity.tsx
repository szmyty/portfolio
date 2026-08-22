"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";

import { InfinityGeometry } from "../../geometry/InfinityGeometry";
import { getInfinityVisualScale } from "../../geometry/InfinityGeometry/infinityCurve";
import { InfinityEnergyMaterial } from "../../materials";
import { BloomEffect, ParticleTrail } from "../../effects";

import { useInfinityInteraction } from "../../hooks/useInfinityInteraction";
import { useInfinityMotion } from "../../hooks/useInfinityMotion";
import type { InfinityProps } from "./Infinity.types";
import { isDev } from "@portfolio/config";
import { setDebugInteraction } from "@portfolio/lib/debug/debugStore";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * Emissive intensity levels
 */
const IDLE_EMISSIVE = 0.15;
const HOVER_EMISSIVE = 0.6;
const ENGAGED_EMISSIVE = 1.0;

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
  MaterialComponent = InfinityEnergyMaterial,
  effects = { glow: true, particles: true, rotation: true },
  position = [0, 0, 0],
}: InfinityProps) {
  const logger = useLifecycleLogger("Infinity");
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
    logger.emit("reduced-motion-detected", {
      enabled: reducedMotion.current,
    });
  }, [logger]);

  useEffect(() => {
    canvasRef.current = gl.domElement;
    logger.emitOnce("canvas-bound", "canvas-bound");
  }, [gl, logger]);

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
    onPointerDownStart: effects.rotation !== false ? motion.resetVelocity : undefined,
    onDrag: effects.rotation !== false ? motion.applyDrag : undefined,
  });

  /**
   * Frame loop
   */
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    logger.emitOnce("first-frame", "first-frame", {
      position,
      rotationEnabled: effects.rotation !== false,
    });

    const isEngaged = interaction.interactionState.current === "engaged";

    /**
     * Motion update: inertia coast → idle auto-rotation fallback.
     * Skipped while dragging (useInfinityMotion handles that via applyDrag).
     * Skipped entirely when effects.rotation is false.
     */
    if (effects.rotation !== false) {
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
    }

    /**
     * Centered hero position
     */
    meshRef.current.position.set(position[0], position[1], position[2]);

    /**
     * Viewport-aware base scale.
     *
     * The fit includes the tube and particle halo rather than measuring only
     * the curve. Portrait screens reserve 28% of their width as breathing
     * room; wider screens use a slightly quieter 64% footprint.
     */
    const { viewport } = state;
    const baseScale = getInfinityVisualScale(viewport.width, viewport.height);

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
