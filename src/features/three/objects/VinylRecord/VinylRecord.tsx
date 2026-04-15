"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  Box3,
  Mesh,
  BufferGeometry,
  MeshStandardMaterial,
  SRGBColorSpace,
  Texture,
  TextureLoader,
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
const BASE_ROTATION_X = 0.18;
const BASE_ROTATION_Y = 0.18;
const LABEL_RADIUS = 0.33;
const LABEL_SOFTNESS = 0.025;
const LABEL_SPINDLE = 0.04;

function cloneVinylMaterials(
  material: Mesh["material"],
  isLight: boolean,
  labelTexture: Texture,
  labelAxisU: Vector3,
  labelAxisV: Vector3,
  labelPlaneRadius: number,
) {
  const materials = Array.isArray(material) ? material : [material];

  return materials.map((entry) => {
    if (!(entry instanceof MeshStandardMaterial)) {
      return entry;
    }

    const nextMaterial = entry.clone();
    nextMaterial.map = null;
    nextMaterial.color.set(isLight ? "#131018" : "#050509");
    nextMaterial.roughness = isLight
      ? Math.min(nextMaterial.roughness + 0.08, 1)
      : Math.min(nextMaterial.roughness + 0.16, 1);
    nextMaterial.metalness = isLight
      ? Math.max(nextMaterial.metalness - 0.08, 0)
      : Math.max(nextMaterial.metalness - 0.12, 0);
    nextMaterial.envMapIntensity = isLight ? 1.2 : 1.55;
    nextMaterial.emissive.set(isLight ? "#f1bed6" : "#8f4f92");
    nextMaterial.emissiveIntensity = IDLE_EMISSIVE;
    nextMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.labelMap = { value: labelTexture };
      shader.uniforms.labelRadius = { value: LABEL_RADIUS };
      shader.uniforms.labelSoftness = { value: LABEL_SOFTNESS };
      shader.uniforms.labelSpindle = { value: LABEL_SPINDLE };
      shader.uniforms.labelAxisU = { value: labelAxisU };
      shader.uniforms.labelAxisV = { value: labelAxisV };
      shader.uniforms.labelPlaneRadius = { value: labelPlaneRadius };

      shader.vertexShader = `
        varying vec3 vLabelPosition;
      ` + shader.vertexShader.replace(
        "#include <begin_vertex>",
        `#include <begin_vertex>
         vLabelPosition = transformed;`,
      );

      shader.fragmentShader = `
        uniform sampler2D labelMap;
        uniform float labelRadius;
        uniform float labelSoftness;
        uniform float labelSpindle;
        uniform vec3 labelAxisU;
        uniform vec3 labelAxisV;
        uniform float labelPlaneRadius;
        varying vec3 vLabelPosition;
      ` + shader.fragmentShader.replace(
        "#include <color_fragment>",
        `#include <color_fragment>
         vec2 labelPlane = vec2(dot(vLabelPosition, labelAxisU), dot(vLabelPosition, labelAxisV));
         vec2 normalizedLabel = labelPlane / labelPlaneRadius;
         float labelDistance = length(normalizedLabel);
         float outerMask = 1.0 - smoothstep(labelRadius, labelRadius + labelSoftness, labelDistance);
         float spindleMask = smoothstep(labelSpindle, labelSpindle + labelSoftness, labelDistance);
         float finalLabelMask = outerMask * spindleMask;
         vec2 labelSampleUv = (normalizedLabel / labelRadius) * 0.5 + 0.5;
         vec4 labelSample = texture2D(labelMap, labelSampleUv);
         diffuseColor.rgb = mix(diffuseColor.rgb, labelSample.rgb, finalLabelMask);`,
      );
    };
    nextMaterial.needsUpdate = true;
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
  const labelTexture = useLoader(
    TextureLoader,
    "/textures/artist/playfunction-profile.png",
  );
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

  useEffect(() => {
    labelTexture.colorSpace = SRGBColorSpace;
    logger.emit("label-texture-ready");
  }, [labelTexture, logger]);

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
    geometry.computeBoundingBox();

    const scaledBounds = geometry.boundingBox ?? new Box3();
    const scaledSize = scaledBounds.getSize(new Vector3());
    const labelAxes = [
      { axis: new Vector3(1, 0, 0), size: scaledSize.x },
      { axis: new Vector3(0, 1, 0), size: scaledSize.y },
      { axis: new Vector3(0, 0, 1), size: scaledSize.z },
    ].sort((left, right) => right.size - left.size);
    const labelPlaneRadius = Math.max(labelAxes[0]?.size ?? 1, labelAxes[1]?.size ?? 1) / 2;

    const materials = cloneVinylMaterials(
      sourceMesh.material,
      isLight,
      labelTexture,
      labelAxes[0]?.axis ?? new Vector3(1, 0, 0),
      labelAxes[1]?.axis ?? new Vector3(0, 1, 0),
      labelPlaneRadius,
    );

    logger.emit("model-ready", {
      meshName: sourceMesh.name,
      isLight,
      scale,
      size: {
        x: size.x,
        y: size.y,
        z: size.z,
      },
      labelPlaneRadius,
    });

    return {
      geometry,
      material: materials.length === 1 ? materials[0] : materials,
    };
  }, [isLight, labelTexture, logger, scene]);

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
