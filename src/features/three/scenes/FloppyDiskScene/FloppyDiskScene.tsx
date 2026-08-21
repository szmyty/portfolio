"use client";

import { useCallback, useEffect, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { Box3, Vector3 } from "three";
import type { PerspectiveCamera } from "three";
import { FloppyDisk } from "@portfolio/features/three/objects";
import {
  FLOPPY_CAMERA_FOV,
  FLOPPY_CAMERA_PADDING_RATIO,
  getPerspectiveCameraFitDistanceToSphere,
  getRotationSafeRadius,
} from "@portfolio/features/three/lib";
import { useTheme } from "@portfolio/lib/theme";
import { useLifecycleLogger } from "@portfolio/lib/debug/useLifecycleLogger";

type CameraRigProps = {
  bounds: Box3 | null;
};

function CameraRig({ bounds }: CameraRigProps) {
  const { camera, size } = useThree();

  useEffect(() => {
    if (!bounds) return;

    const measuredSize = bounds.getSize(new Vector3());
    const rotationSafeRadius = getRotationSafeRadius({
      width: measuredSize.x,
      height: measuredSize.y,
      depth: measuredSize.z,
    });
    const distance = getPerspectiveCameraFitDistanceToSphere({
      radius: rotationSafeRadius,
      aspect: size.width / Math.max(size.height, 1),
      verticalFovDegrees: FLOPPY_CAMERA_FOV,
      paddingRatio: FLOPPY_CAMERA_PADDING_RATIO,
    });
    const perspectiveCamera = camera as PerspectiveCamera;

    // eslint-disable-next-line react-hooks/immutability
    perspectiveCamera.fov = FLOPPY_CAMERA_FOV;
    perspectiveCamera.position.set(0, 0.08, distance);
    perspectiveCamera.near = Math.max(0.1, distance / 100);
    perspectiveCamera.far = Math.max(100, distance * 4);
    perspectiveCamera.lookAt(0, 0.08, 0);
    perspectiveCamera.updateProjectionMatrix();
  }, [bounds, camera, size.height, size.width]);

  return null;
}

/**
 * FloppyDiskScene — Canvas wrapper for the OBJ-backed floppy disk visual.
 *
 * Uses a multi-light rig to keep metallic/plastic highlights legible in both
 * light and dark themes.
 */
export function FloppyDiskScene() {
  const logger = useLifecycleLogger("FloppyDiskScene");
  const { resolvedTheme } = useTheme();
  const isLight = resolvedTheme === "light";
  const [modelBounds, setModelBounds] = useState<Box3 | null>(null);
  const handleBoundsChange = useCallback((nextBounds: Box3) => {
    setModelBounds((currentBounds) =>
      currentBounds?.equals(nextBounds) ? currentBounds : nextBounds.clone(),
    );
  }, []);

  return (
    <Canvas
      camera={{ position: [0, 0.08, 12], fov: FLOPPY_CAMERA_FOV }}
      style={{ width: "100%", height: "100%" }}
      dpr={[1, 1.25]}
      gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        logger.emit("canvas-created", {
          dpr: gl.getPixelRatio(),
          isLight,
        });

        gl.domElement.addEventListener("webglcontextlost", () => {
          logger.emit("webgl-context-lost");
        });

        gl.domElement.addEventListener("webglcontextrestored", () => {
          logger.emit("webgl-context-restored");
        });
      }}
    >
      <CameraRig bounds={modelBounds} />
      <ambientLight intensity={isLight ? 0.58 : 0.42} />
      <hemisphereLight
        intensity={isLight ? 0.5 : 0.45}
        color={isLight ? "#f7fbff" : "#b8caf8"}
        groundColor={isLight ? "#d7c7be" : "#1e2230"}
      />
      <directionalLight
        position={[3.2, 4.8, 5.2]}
        intensity={isLight ? 1.24 : 1.05}
        color={isLight ? "#ffffff" : "#ffdff0"}
      />
      <directionalLight
        position={[-3.5, -1.2, -3.8]}
        intensity={isLight ? 0.5 : 0.45}
        color={isLight ? "#e4efff" : "#9ecbff"}
      />
      <directionalLight
        position={[1.8, 1.8, -4.8]}
        intensity={isLight ? 0.46 : 0.54}
        color={isLight ? "#ffe1d0" : "#ffc3e7"}
      />
      <pointLight
        position={[0, 0.28, 4]}
        intensity={isLight ? 0.44 : 0.54}
        color={isLight ? "#fefcff" : "#ffd9f4"}
      />
      <FloppyDisk onBoundsChange={handleBoundsChange} />
    </Canvas>
  );
}
