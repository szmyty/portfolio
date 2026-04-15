"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Box3,
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

function setMaterialEmissive(root: Group, intensity: number) {
  root.traverse((child) => {
    if (!(child instanceof Mesh)) return;

    const materials = Array.isArray(child.material)
      ? child.material
      : [child.material];

    for (const material of materials) {
      if (material instanceof MeshStandardMaterial) {
        material.emissiveIntensity = intensity;
      }
    }
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
    const clone = obj.clone(true);
    const bounds = new Box3().setFromObject(clone);
    const size = bounds.getSize(new Vector3());
    const center = bounds.getCenter(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z) || 1;
    const scale = TARGET_SIZE / maxDimension;

    clone.position.sub(center);
    clone.scale.setScalar(scale);

    clone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      child.castShadow = false;
      child.receiveShadow = true;
      child.material = new MeshStandardMaterial({
        color: isLight ? "#fff8fd" : "#f2dff5",
        roughness: isLight ? 0.34 : 0.42,
        metalness: isLight ? 0.12 : 0.08,
        emissive: isLight ? "#f0a5d1" : "#8a3f86",
        emissiveIntensity: IDLE_EMISSIVE,
      });
    });

    logger.emit("material-ready", {
      isLight,
      scale,
      childCount: clone.children.length,
    });

    return clone;
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
    if (!rootRef.current) return;

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

    setMaterialEmissive(
      rootRef.current,
      emissiveTarget.current,
    );
  });

  return (
    <group
      ref={rootRef}
      onPointerDown={interaction.handlePointerDown}
      onPointerEnter={interaction.handlePointerEnter}
      onPointerLeave={interaction.handlePointerLeave}
    >
      <primitive object={floppyObject} />
    </group>
  );
}
