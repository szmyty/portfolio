"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useFrame, useLoader, useThree } from "@react-three/fiber";
import {
  LinearFilter,
  Mesh,
  MeshStandardMaterial,
  SRGBColorSpace,
  TextureLoader,
  VideoTexture,
} from "three";

import { MagazineGeometry } from "../../geometry/MagazineGeometry";
import { useInfinityInteraction } from "../../hooks/useInfinityInteraction";
import { useMagazineMotion } from "../../hooks/useMagazineMotion";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

/**
 * Emissive intensity levels (subtle, matches a matte paper surface)
 */
const IDLE_EMISSIVE = 0.05;
const HOVER_EMISSIVE = 0.3;
const ENGAGED_EMISSIVE = 0.6;
const FRONT_EMISSIVE_BOOST = 0.2;
const BACK_EMISSIVE_BOOST = 0.35;

/**
 * Magazine
 *
 * Interactive 3D magazine object with:
 * - portrait box geometry (2 × 3 × 0.02)
 * - slow Y-axis idle auto-rotation
 * - drag rotation (hold-to-engage, 250 ms threshold) on both axes
 * - inertia coast after release
 * - hover and engagement emissive feedback
 *
 * Geometry proportions match the ego-hygiene-edition-1 cover image.
 * Textures will be applied in a follow-up issue.
 */
export function Magazine() {
  const logger = useLifecycleLogger("Magazine");
  const meshRef = useRef<Mesh>(null);

  const emissiveTarget = useRef(IDLE_EMISSIVE);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const { gl } = useThree();
  const backTexture = useLoader(
    TextureLoader,
    "/textures/publishing/magazine/ego-hygiene-back.png",
  );
  const [videoTexture, setVideoTexture] = useState<VideoTexture | null>(null);

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
    backTexture.colorSpace = SRGBColorSpace;
    backTexture.flipY = true;
    backTexture.minFilter = LinearFilter;
    backTexture.magFilter = LinearFilter;
    logger.emit("back-texture-ready");
  }, [backTexture, logger]);

  useEffect(() => {
    const video = document.createElement("video");
    video.src = "/textures/publishing/magazine/ego-hygiene-front.mp4";
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    const texture = new VideoTexture(video);
    texture.colorSpace = SRGBColorSpace;
    texture.flipY = true;
    texture.minFilter = LinearFilter;
    texture.magFilter = LinearFilter;
    texture.generateMipmaps = false;

    videoRef.current = video;
    setVideoTexture(texture);

    void video.play().catch((error: unknown) => {
      logger.emit("video-playback-blocked", {
        error: error instanceof Error ? error.message : String(error),
      });
    });

    logger.emit("video-texture-ready");

    return () => {
      video.pause();
      video.removeAttribute("src");
      video.load();
      texture.dispose();
      videoRef.current = null;
      setVideoTexture(null);
    };
  }, [logger]);

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

  const materials = useMemo(() => {
    const createPaperMaterial = () =>
      new MeshStandardMaterial({
        color: "#e8e0d0",
        roughness: 0.6,
        metalness: 0.1,
        emissive: "#c8bfaf",
        emissiveIntensity: IDLE_EMISSIVE,
      });

    const nextMaterials = Array.from({ length: 6 }, createPaperMaterial);
    const frontMaterial = createPaperMaterial();
    frontMaterial.map = videoTexture;
    frontMaterial.toneMapped = false;
    frontMaterial.color.set("#ffffff");
    frontMaterial.emissive.set("#ffffff");
    frontMaterial.emissiveMap = videoTexture;
    frontMaterial.emissiveIntensity = 0.25;
    frontMaterial.envMapIntensity = 1.1;
    frontMaterial.needsUpdate = true;

    const backMaterial = createPaperMaterial();
    backMaterial.map = backTexture;
    backMaterial.toneMapped = false;
    backMaterial.color.set("#ffffff");
    backMaterial.emissive.set("#ffffff");
    backMaterial.emissiveMap = backTexture;
    backMaterial.emissiveIntensity = 0.4;
    backMaterial.needsUpdate = true;

    // BoxGeometry material order: right, left, top, bottom, front, back.
    nextMaterials[4] = frontMaterial;
    nextMaterials[5] = backMaterial;

    return nextMaterials;
  }, [backTexture, videoTexture]);

  useEffect(() => {
    return () => {
      for (const material of materials) {
        material.dispose();
      }
    };
  }, [materials]);

  /**
   * Frame loop
   */
  useFrame((_, delta) => {
    if (!meshRef.current) return;

    logger.emitOnce("first-frame", "first-frame");

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
    for (const material of materials) {
      const current = material.emissiveIntensity;
      const target =
        material.map === videoTexture
          ? emissiveTarget.current + FRONT_EMISSIVE_BOOST
          : material.map === backTexture
            ? emissiveTarget.current + BACK_EMISSIVE_BOOST
          : emissiveTarget.current;

      material.emissiveIntensity =
        current + (target - current) * Math.min(delta * 6, 1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      material={materials}
      onPointerDown={interaction.handlePointerDown}
      onPointerEnter={interaction.handlePointerEnter}
      onPointerLeave={interaction.handlePointerLeave}
    >
      <MagazineGeometry />
    </mesh>
  );
}
