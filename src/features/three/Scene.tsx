"use client";

import { Canvas } from "@react-three/fiber";
import { InfinityKnot } from "./InfinityKnot";

/**
 * Scene renders a Three.js canvas using React Three Fiber.
 *
 * Marked as a client component because WebGL requires access to the DOM.
 * Import this component via dynamic import with ssr: false to avoid
 * server-side rendering errors.
 *
 * Lighting setup:
 * - ambientLight: soft base illumination across all surfaces to avoid
 *   fully unlit areas.
 * - key directionalLight: primary light from upper-right to create depth
 *   and surface shading without overexposure.
 * - fill directionalLight: low-intensity counter-light from the opposite
 *   side to soften shadow contrast and ensure even visibility.
 */
export function Scene() {
  return (
    <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
      {/* Soft ambient base so no surface is completely dark */}
      <ambientLight intensity={0.4} />
      {/* Key light from upper-right — creates depth and gentle shading */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      {/* Fill light from opposite side — reduces harsh shadow contrast */}
      <directionalLight position={[-5, -2, -5]} intensity={0.3} />
      <InfinityKnot />
    </Canvas>
  );
}
