"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Box3,
  BufferGeometry,
  DoubleSide,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
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
const BODY_OPACITY = 0.78;
const BODY_CLEARCOAT = 0.2;

function createTranslucentFloppyMaterial(isLight: boolean) {
  return new MeshPhysicalMaterial({
    color: isLight ? "#f4a9cf" : "#d86db0",
    roughness: isLight ? 0.32 : 0.36,
    metalness: 0.02,
    transparent: true,
    opacity: BODY_OPACITY,
    transmission: isLight ? 0.1 : 0.14,
    thickness: 0.14,
    ior: 1.1,
    clearcoat: BODY_CLEARCOAT,
    clearcoatRoughness: 0.34,
    attenuationColor: isLight ? "#ffcae4" : "#f08ac5",
    attenuationDistance: 0.85,
    emissive: isLight ? "#f2a1cb" : "#9f4b8a",
    emissiveIntensity: IDLE_EMISSIVE + 0.015,
    side: DoubleSide,
  });
}

function createLabelPlateMaterial() {
  return new MeshStandardMaterial({
    color: "#fffdf8",
    roughness: 0.76,
    metalness: 0.02,
  });
}

function createLabelImageMaterial(labelTexture: Texture) {
  return new MeshStandardMaterial({
    map: labelTexture,
    color: "#ffffff",
    roughness: 0.64,
    metalness: 0,
    transparent: false,
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
  const labelTexture = useLoader(
    TextureLoader,
    "/textures/github/github-profile.png",
  );
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

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    labelTexture.colorSpace = SRGBColorSpace;
    logger.emit("label-texture-ready");
  }, [labelTexture, logger]);

  const floppyObject = useMemo(() => {
    const objClone = obj.clone(true);
    objClone.updateMatrixWorld(true);

    const bakedMeshes: Array<{
      geometry: BufferGeometry;
      material: MeshPhysicalMaterial;
    }> = [];

    objClone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const geometry = child.geometry.clone() as BufferGeometry;
      geometry.applyMatrix4(child.matrixWorld);

      bakedMeshes.push({
        geometry,
        material: createTranslucentFloppyMaterial(isLight),
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

    const scaledBounds = new Box3();
    for (const mesh of bakedMeshes) {
      mesh.geometry.computeBoundingBox();
      if (mesh.geometry.boundingBox) {
        scaledBounds.union(mesh.geometry.boundingBox);
      }
    }

    const scaledSize = scaledBounds.getSize(new Vector3());
    const frontZ = scaledBounds.max.z + 0.012;
    const labelWidth = scaledSize.x * 0.58;
    const labelHeight = scaledSize.y * 0.27;
    const labelCenterY = scaledBounds.max.y - labelHeight * 0.86;
    const avatarSize = Math.min(labelHeight * 0.84, labelWidth * 0.4);
    const avatarCenterX = -labelWidth * 0.23;

    const labelPlateMaterial = createLabelPlateMaterial();
    const labelImageMaterial = createLabelImageMaterial(labelTexture);

    logger.emit("material-ready", {
      isLight,
      scale,
      meshCount: bakedMeshes.length,
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
      label: {
        width: labelWidth,
        height: labelHeight,
      },
    });

    return {
      bodyMeshes: bakedMeshes,
      label: {
        plateMaterial: labelPlateMaterial,
        imageMaterial: labelImageMaterial,
        width: labelWidth,
        height: labelHeight,
        centerY: labelCenterY,
        frontZ,
        avatarSize,
        avatarCenterX,
      },
    };
  }, [isLight, labelTexture, logger, obj]);

  useEffect(() => {
    if (!floppyObject) {
      return;
    }

    return () => {
      for (const mesh of floppyObject.bodyMeshes) {
        mesh.material.dispose();
      }
      floppyObject.label.plateMaterial.dispose();
      floppyObject.label.imageMaterial.dispose();
    };
  }, [floppyObject]);

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

    const materials = floppyObject.bodyMeshes.map((mesh) => mesh.material);
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
      {floppyObject.bodyMeshes.map((mesh, index) => (
        <mesh
          key={index}
          geometry={mesh.geometry}
          material={mesh.material}
          castShadow={false}
          receiveShadow
        />
      ))}
      <mesh
        position={[0, floppyObject.label.centerY, floppyObject.label.frontZ]}
        material={floppyObject.label.plateMaterial}
      >
        <planeGeometry
          args={[floppyObject.label.width, floppyObject.label.height]}
        />
      </mesh>
      <mesh
        position={[
          floppyObject.label.avatarCenterX,
          floppyObject.label.centerY,
          floppyObject.label.frontZ + 0.002,
        ]}
        material={floppyObject.label.imageMaterial}
      >
        <planeGeometry
          args={[
            floppyObject.label.avatarSize,
            floppyObject.label.avatarSize,
          ]}
        />
      </mesh>
    </group>
  );
}
