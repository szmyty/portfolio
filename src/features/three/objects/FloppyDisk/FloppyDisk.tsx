"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Box3,
  BufferGeometry,
  Group,
  Mesh,
  MeshStandardMaterial,
  Vector3,
} from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { useInfinityInteraction } from "../../hooks/useInfinityInteraction";
import { useFloppyDiskMotion } from "../../hooks/useFloppyDiskMotion";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

const IDLE_EMISSIVE = 0.04;
const HOVER_EMISSIVE = 0.18;
const ENGAGED_EMISSIVE = 0.35;
const TARGET_SIZE = 4.25;
const BASE_ROTATION_X = -0.28;
const BASE_ROTATION_Y = 0.55;

function cloneFloppyMaterial(isLight: boolean) {
  return new MeshStandardMaterial({
    color: isLight ? "#fff8fd" : "#f2dff5",
    roughness: isLight ? 0.34 : 0.42,
    metalness: isLight ? 0.12 : 0.08,
    emissive: isLight ? "#f0a5d1" : "#8a3f86",
    emissiveIntensity: IDLE_EMISSIVE,
  });
}

/**
 * FloppyDisk
 *
 * First-pass OBJ-backed visual for the Development section.
 * The model is centered, uniformly scaled, and assigned a theme-aware material
 * so we can validate orientation and proportions before adding a label/avatar.
 */
export function FloppyDisk() {
  const logger = useLifecycleLogger("FloppyDisk");
  const rootRef = useRef<Group>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const emissiveTarget = useRef(IDLE_EMISSIVE);
  const reducedMotion = useRef(false);

  const obj = useLoader(OBJLoader, "/models/floppy-disk.obj");
  const motion = useFloppyDiskMotion();
  const { gl } = useThree();
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";

  useEffect(() => {
    canvasRef.current = gl.domElement;
    logger.emitOnce("canvas-bound", "canvas-bound");
  }, [gl, logger]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    logger.emit("reduced-motion-detected", {
      enabled: reducedMotion.current,
    });
  }, [logger]);

  useEffect(() => {
    logger.emit("loader-resolved", {
      type: obj.type,
      childCount: obj.children.length,
    });
  }, [logger, obj]);

  const floppyObject = useMemo(() => {
    const objClone = obj.clone(true);
    objClone.updateMatrixWorld(true);

    const bakedMeshes: Array<{
      geometry: BufferGeometry;
      material: MeshStandardMaterial;
    }> = [];

    objClone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const geometry = child.geometry.clone() as BufferGeometry;
      geometry.applyMatrix4(child.matrixWorld);

      bakedMeshes.push({
        geometry,
        material: cloneFloppyMaterial(isLight),
      });
    });

    if (bakedMeshes.length === 0) {
      logger.emit("source-mesh-missing");
      return null;
    }

    const bounds = new Box3();
    for (const mesh of bakedMeshes) {
      mesh.geometry.computeBoundingBox();
      if (mesh.geometry.boundingBox) {
        bounds.union(mesh.geometry.boundingBox);
      }
    }

    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDimension;

    for (const mesh of bakedMeshes) {
      mesh.geometry.translate(-center.x, -center.y, -center.z);
      mesh.geometry.scale(scale, scale, scale);
    }

    logger.emit("material-ready", {
      isLight,
      scale,
      meshCount: bakedMeshes.length,
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
    });

    return bakedMeshes;
  }, [isLight, logger, obj]);

  const interaction = useInfinityInteraction({
    canvasRef,
    emissiveTargetRef: emissiveTarget,
    IDLE_EMISSIVE,
    HOVER_EMISSIVE,
    ENGAGED_EMISSIVE,
    onPointerDownStart: motion.resetVelocity,
    onDrag: motion.applyDrag,
  });

  useFrame((_, delta) => {
    if (!rootRef.current || !floppyObject) return;

    logger.emitOnce("first-frame", "first-frame", {
      rotationX: BASE_ROTATION_X,
      rotationY: BASE_ROTATION_Y,
    });

    const isEngaged = interaction.interactionState.current === "engaged";

    motion.updateMotion({
      delta,
      isEngaged,
      reducedMotion: reducedMotion.current,
    });

    rootRef.current.rotation.x = BASE_ROTATION_X + motion.rotX.current * 0.35;
    rootRef.current.rotation.y = BASE_ROTATION_Y + motion.rotY.current;

    const isHovered = interaction.isHovered.current;
    const targetNorm = isEngaged ? 1.05 : isHovered ? 1.025 : 1.0;
    const currentNorm = rootRef.current.scale.x;
    const nextNorm =
      currentNorm + (targetNorm - currentNorm) * Math.min(delta * 8, 1);
    rootRef.current.scale.setScalar(nextNorm);

    const materials = floppyObject.map((mesh) => mesh.material);
    for (const material of materials) {
      const current = material.emissiveIntensity;
      material.emissiveIntensity =
        current +
        (emissiveTarget.current - current) * Math.min(delta * 6, 1);
    }
  });

  if (!floppyObject) {
    return null;
  }

  return (
    <group
      ref={rootRef}
      onPointerDown={interaction.handlePointerDown}
      onPointerEnter={interaction.handlePointerEnter}
      onPointerLeave={interaction.handlePointerLeave}
    >
      {floppyObject.map((mesh, index) => (
        <mesh
          key={index}
          geometry={mesh.geometry}
          material={mesh.material}
          castShadow={false}
          receiveShadow
        />
      ))}
    </group>
  );
}
