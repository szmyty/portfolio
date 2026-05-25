"use client";

import { useEffect } from "react";
import { Canvas, useLoader, useThree } from "@react-three/fiber";
import { EXRLoader } from "three/examples/jsm/loaders/EXRLoader.js";
import { EquirectangularReflectionMapping } from "three";
import type { GalaxyBackgroundProps } from "./GalaxyBackground.types";

function GalaxyEnvironment() {
  const texture = useLoader(EXRLoader, "/environments/galaxy.exr");
  const { gl, scene } = useThree();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/immutability
    texture.mapping = EquirectangularReflectionMapping;

    // eslint-disable-next-line react-hooks/immutability
    scene.background = texture;
    scene.environment = texture;

    // eslint-disable-next-line react-hooks/immutability
    gl.toneMappingExposure = 0.7;

    return () => {
      scene.background = null;
      scene.environment = null;
    };
  }, [gl, scene, texture]);

  return null;
}

export function GalaxyBackground(_props: GalaxyBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      <Canvas
        camera={{ position: [0, 0, 1], fov: 50 }}
        dpr={[1, 1.25]}
        gl={{ alpha: true, antialias: false, powerPreference: "low-power" }}
      >
        <GalaxyEnvironment />
      </Canvas>
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}
