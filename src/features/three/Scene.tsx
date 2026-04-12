"use client";

import { Canvas } from "@react-three/fiber";
import { InfinityKnot } from "./InfinityKnot";

/**
 * Scene renders a Three.js canvas using React Three Fiber.
 *
 * Marked as a client component because WebGL requires access to the DOM.
 * Import this component via dynamic import with ssr: false to avoid
 * server-side rendering errors.
 */
export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <InfinityKnot />
    </Canvas>
  );
}
