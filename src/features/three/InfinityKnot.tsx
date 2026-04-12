"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Mesh } from "three";

/**
 * InfinityKnot renders a torus-knot geometry configured with p=2, q=1
 * to approximate an infinity (lemniscate) shape.
 *
 * Parameters:
 *   - radius: overall size of the knot path
 *   - tube: thickness of the tube
 *   - tubularSegments: smoothness along the tube length
 *   - radialSegments: smoothness around the tube cross-section
 *   - p=2, q=1: winding numbers that produce the figure-eight / infinity form
 *
 * Idle animation:
 *   - slow continuous rotation on X and Y axes for a sense of presence
 *   - subtle sinusoidal vertical float to make the object feel alive
 */
export function InfinityKnot() {
  const meshRef = useRef<Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.rotation.x = t * 0.15;
    meshRef.current.rotation.y = t * 0.25;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.15;
  });

  return (
    <mesh ref={meshRef}>
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 1]} />
      <meshStandardMaterial color="#6366f1" roughness={0.4} metalness={0.6} />
    </mesh>
  );
}
