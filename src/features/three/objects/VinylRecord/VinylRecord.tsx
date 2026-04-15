"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import {
  Box3,
  Mesh,
  BufferGeometry,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { useInfinityInteraction } from "../../hooks/useInfinityInteraction";
import { useVinylRecordMotion } from "../../hooks/useVinylRecordMotion";
import type { VinylRecordProps } from "./VinylRecord.types";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";
import { useTheme } from "@portfolio/lib/theme";

/**
 * Emissive intensity levels (subtle sheen on a dark vinyl surface)
 */
const IDLE_EMISSIVE = 0.02;
const HOVER_EMISSIVE = 0.18;
const ENGAGED_EMISSIVE = 0.35;
const TARGET_SIZE = 3.4;
const BASE_ROTATION_X = 0.22;
const BASE_ROTATION_Y = -0.18;

function cloneVinylMaterials(
  material: Mesh["material"],
  isLight: boolean,
) {
  const materials = Array.isArray(material) ? material : [material];

  return materials.map((entry) => {
    if (!(entry instanceof MeshStandardMaterial)) {
      return entry;
    }

    const nextMaterial = entry.clone();
    nextMaterial.roughness = isLight
      ? Math.min(nextMaterial.roughness + 0.08, 1)
      : Math.min(nextMaterial.roughness + 0.16, 1);
    nextMaterial.metalness = isLight
      ? Math.max(nextMaterial.metalness - 0.08, 0)
      : Math.max(nextMaterial.metalness - 0.12, 0);
    nextMaterial.envMapIntensity = isLight ? 1.2 : 1.55;
    nextMaterial.emissive.set(isLight ? "#f1bed6" : "#8f4f92");
    nextMaterial.emissiveIntensity = IDLE_EMISSIVE;
    return nextMaterial;
  });
}

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
  effects = { rotation: true },
}: VinylRecordProps) {
  const logger = useLifecycleLogger("VinylRecord");
  const meshRef = useRef<Mesh>(null);

  const emissiveTarget = useRef(IDLE_EMISSIVE);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { gl } = useThree();
  const { scene } = useGLTF("/models/vinyl-record/vinyl-record.glb");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

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

  useEffect(() => {
    logger.emit("loader-resolved", {
      childCount: scene.children.length,
      type: scene.type,
    });
  }, [logger, scene]);

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

  const vinylObject = useMemo(() => {
    const sceneClone = scene.clone(true);
    sceneClone.updateMatrixWorld(true);

    let sourceMesh: Mesh | undefined;
    sceneClone.traverse((child) => {
      if (sourceMesh || !(child instanceof Mesh)) return;
      sourceMesh = child;
    });

    if (!sourceMesh) {
      logger.emit("source-mesh-missing");
      return null;
    }

    const geometry = sourceMesh.geometry.clone() as BufferGeometry;
    geometry.applyMatrix4(sourceMesh.matrixWorld);

    geometry.computeBoundingBox();
    const bounds = geometry.boundingBox ?? new Box3();
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDimension;

    geometry.translate(-center.x, -center.y, -center.z);
    geometry.scale(scale, scale, scale);

    const materials = cloneVinylMaterials(sourceMesh.material, isLight);

    logger.emit("model-ready", {
      meshName: sourceMesh.name,
      isLight,
      scale,
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
    });

    return {
      geometry,
      material: materials.length === 1 ? materials[0] : materials,
    };
  }, [isLight, logger, scene]);

  /**
   * Frame loop
   */
  useFrame((_, delta) => {
    if (!meshRef.current || !vinylObject) return;

    logger.emitOnce("first-frame", "first-frame", {
      rotationEnabled: effects.rotation !== false,
      baseRotationX: BASE_ROTATION_X,
      baseRotationY: BASE_ROTATION_Y,
    });

    const isEngaged = interaction.interactionState.current === "engaged";

    if (effects.rotation !== false) {
      motion.updateMotion({
        delta,
        isEngaged,
        reducedMotion: reducedMotion.current,
      });

      /**
       * Imported GLB already carries baked orientation transforms, so we keep
       * only a small presentation tilt instead of forcing a 90deg face-on
       * correction like the old procedural cylinder needed.
       */
      meshRef.current.rotation.x = BASE_ROTATION_X + motion.rotX.current * 0.35;
      meshRef.current.rotation.y = BASE_ROTATION_Y + motion.rotY.current * 0.45;
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
    const materials = Array.isArray(meshRef.current.material)
      ? meshRef.current.material
      : [meshRef.current.material];

    for (const material of materials) {
      if (!(material instanceof MeshStandardMaterial)) continue;

      const current = material.emissiveIntensity;
      material.emissiveIntensity =
        current +
        (emissiveTarget.current - current) * Math.min(delta * 6, 1);
    }
  });

  if (!vinylObject) {
    return null;
  }

  return (
    <mesh
      ref={meshRef}
      geometry={vinylObject.geometry}
      material={vinylObject.material}
      castShadow={false}
      receiveShadow
      onPointerDown={interaction.handlePointerDown}
      onPointerEnter={interaction.handlePointerEnter}
      onPointerLeave={interaction.handlePointerLeave}
    />
  );
}

useGLTF.preload("/models/vinyl-record/vinyl-record.glb");
