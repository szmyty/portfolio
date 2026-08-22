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
import { FLOPPY_TARGET_SIZE } from "@portfolio/features/three/lib";

const IDLE_EMISSIVE = 0.04;
const HOVER_EMISSIVE = 0.18;
const ENGAGED_EMISSIVE = 0.35;
const BASE_ROTATION_X = -0.28;
const BASE_ROTATION_Y = 0.55;
const BODY_OPACITY = 0.88;
const BODY_CLEARCOAT = 0.72;

function createShellMaterial(isLight: boolean) {
  return new MeshPhysicalMaterial({
    color: isLight ? "#37404c" : "#282f3d",
    roughness: isLight ? 0.52 : 0.46,
    metalness: 0.16,
    transparent: true,
    opacity: BODY_OPACITY,
    transmission: isLight ? 0.06 : 0.08,
    thickness: 0.08,
    ior: 1.34,
    clearcoat: BODY_CLEARCOAT,
    clearcoatRoughness: 0.22,
    attenuationColor: isLight ? "#8c98ab" : "#66758f",
    attenuationDistance: 1.4,
    emissive: isLight ? "#74819a" : "#4d5f84",
    emissiveIntensity: IDLE_EMISSIVE + 0.015,
    envMapIntensity: isLight ? 1.2 : 1.55,
    reflectivity: 0.55,
    side: DoubleSide,
  });
}

function createShutterMaterial(isLight: boolean) {
  return new MeshPhysicalMaterial({
    color: isLight ? "#b9bfca" : "#8d96a5",
    roughness: isLight ? 0.2 : 0.26,
    metalness: 0.9,
    clearcoat: 0.25,
    clearcoatRoughness: 0.18,
    emissive: isLight ? "#9aa2b4" : "#737f95",
    emissiveIntensity: IDLE_EMISSIVE * 0.66,
    envMapIntensity: isLight ? 1.45 : 1.85,
    side: DoubleSide,
  });
}

function createAccentMaterial(isLight: boolean) {
  return new MeshPhysicalMaterial({
    color: isLight ? "#2d3340" : "#1e2431",
    roughness: isLight ? 0.4 : 0.34,
    metalness: 0.35,
    clearcoat: 0.45,
    clearcoatRoughness: 0.25,
    emissive: isLight ? "#59657f" : "#405277",
    emissiveIntensity: IDLE_EMISSIVE * 0.9,
    envMapIntensity: isLight ? 1.1 : 1.4,
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
 * OBJ-backed visual for the Development section with layered PBR materials
 * tuned to read as plastic shell + metallic shutter details.
 */
type FloppyDiskProps = {
  onBoundsChange?: (bounds: Box3) => void;
};

export function FloppyDisk({ onBoundsChange }: FloppyDiskProps) {
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
      area2D: number;
    }> = [];

    objClone.traverse((child) => {
      if (!(child instanceof Mesh)) return;

      const geometry = child.geometry.clone() as BufferGeometry;
      geometry.applyMatrix4(child.matrixWorld);
      geometry.computeBoundingBox();
      const bounds = geometry.boundingBox ?? new Box3();
      const size = bounds.getSize(new Vector3());
      const area2D = size.x * size.y;

      bakedMeshes.push({
        geometry,
        material: createShellMaterial(isLight),
        area2D,
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
    const scale = FLOPPY_TARGET_SIZE / maxDimension;

    for (const mesh of bakedMeshes) {
      mesh.geometry.translate(-center.x, -center.y, -center.z);
      mesh.geometry.scale(scale, scale, scale);
    }

    const byAreaDescending = [...bakedMeshes].sort(
      (left, right) => right.area2D - left.area2D,
    );
    const shellMesh = byAreaDescending[0];
    const shutterMesh = byAreaDescending[1];
    const accentMeshes = new Set(byAreaDescending.slice(2));

    if (shellMesh) {
      shellMesh.material.dispose();
      shellMesh.material = createShellMaterial(isLight);
    }
    if (shutterMesh) {
      shutterMesh.material.dispose();
      shutterMesh.material = createShutterMaterial(isLight);
    }
    for (const accentMesh of accentMeshes) {
      accentMesh.material.dispose();
      accentMesh.material = createAccentMaterial(isLight);
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

    const contentBounds = scaledBounds.clone();
    contentBounds.expandByPoint(
      new Vector3(
        -labelWidth / 2,
        labelCenterY - labelHeight / 2,
        frontZ + 0.003,
      ),
    );
    contentBounds.expandByPoint(
      new Vector3(
        labelWidth / 2,
        labelCenterY + labelHeight / 2,
        frontZ + 0.003,
      ),
    );

    return {
      bodyMeshes: bakedMeshes,
      bounds: contentBounds,
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
    if (floppyObject) {
      onBoundsChange?.(floppyObject.bounds.clone());
    }
  }, [floppyObject, onBoundsChange]);

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
