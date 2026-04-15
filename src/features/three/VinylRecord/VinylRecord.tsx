"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { Mesh, MeshStandardMaterial } from "three";

import { VinylRecordGeometry } from "../geometry/VinylRecordGeometry";
import { VinylRecordMaterial } from "../materials/VinylRecordMaterial";
import { useInfinityInteraction } from "../hooks/useInfinityInteraction";
import { useVinylRecordMotion } from "../hooks/useVinylRecordMotion";
import type { VinylRecordProps } from "./VinylRecord.types";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * Emissive intensity levels (subtle sheen on a dark vinyl surface)
 */
const IDLE_EMISSIVE = 0.02;
const HOVER_EMISSIVE = 0.18;
const ENGAGED_EMISSIVE = 0.35;

/**
 * VinylRecord
 *
 * Interactive 3D vinyl record object with:
 * - flat disc cylinder geometry (radius 1.5, thickness 0.05, 128 segments)
 * - face-on orientation: 90° X rotation so the circular face points at the camera
 * - idle Z-axis turntable spin (disc rotating on its own face axis)
 * - drag tilt (hold-to-engage, 250 ms threshold) on X / Y axes
 * - inertia coast after release
 * - hover and engagement emissive feedback
 *
 * Accepts pluggable geometry and material components following the same modular
 * architecture as Infinity, enabling future texture and shader enhancements
 * without modifying this component.
 */
export function VinylRecord({
  GeometryComponent = VinylRecordGeometry,
  MaterialComponent = VinylRecordMaterial,
  effects = { rotation: true },
}: VinylRecordProps) {
  const logger = useLifecycleLogger("VinylRecord");
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
    logger.emit("reduced-motion-detected", {
      enabled: reducedMotion.current,
    });
  }, [logger]);

  useEffect(() => {
    canvasRef.current = gl.domElement;
    logger.emitOnce("canvas-bound", "canvas-bound");
  }, [gl, logger]);

  /**
   * Motion system (Z-axis idle spin, drag tilt, inertia)
   */
  const motion = useVinylRecordMotion();

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
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    logger.emitOnce("first-frame", "first-frame", {
      rotationEnabled: effects.rotation !== false,
    });

    const isEngaged = interaction.interactionState.current === "engaged";

    if (effects.rotation !== false) {
      motion.updateMotion({
        delta,
        isEngaged,
        reducedMotion: reducedMotion.current,
      });

      /**
       * Apply accumulated rotation to the mesh.
       * Base X rotation (Math.PI / 2) orients the disc face toward the camera;
       * motion.rotX adds tilt from drag interaction.
       */
      meshRef.current.rotation.x = Math.PI / 2 + motion.rotX.current;
      meshRef.current.rotation.y = motion.rotY.current;
      meshRef.current.rotation.z = motion.rotZ.current;
    }

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
        <GeometryComponent />
        <MaterialComponent matRef={matRef} />
      </mesh>
    </>
  );
}
