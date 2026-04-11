"use client";

import { Canvas } from "@react-three/fiber";

/**
 * Scene renders a Three.js canvas using React Three Fiber.
 *
 * Marked as a client component because WebGL requires access to the DOM.
 * Import this component via dynamic import with ssr: false to avoid
 * server-side rendering errors.
 */
export function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
    </Canvas>
  );
}
