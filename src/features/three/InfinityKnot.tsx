"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
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
 *
 * Pointer interaction:
 *   - click and drag (or touch and drag) to rotate the object freely
 *   - on release, rotation coasts with damped inertia before settling
 *   - idle animation resumes from the exact drag-release position (no snapping)
 */
export function InfinityKnot() {
  const meshRef = useRef<Mesh>(null);

  // Accumulated rotation in radians; mutated each frame or on drag.
  const rotX = useRef(0);
  const rotY = useRef(0);

  // Per-frame rotation velocity applied after drag release for inertia.
  const velX = useRef(0);
  const velY = useRef(0);

  // Drag state — plain refs avoid re-renders on every pointer event.
  const isDragging = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Store the canvas element in a ref so event handlers can mutate its style
  // without the linter treating it as an immutable hook return value.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gl } = useThree();

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  // Attach window-level listeners so dragging continues when the pointer
  // leaves the mesh bounds, and works on both mouse and touch (pointer events).
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging.current) return;
      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      // Scale factor chosen so a full canvas-width sweep ≈ one full rotation.
      const dvy = dx * 0.006;
      const dvx = dy * 0.006;
      velX.current = dvx;
      velY.current = dvy;
      rotY.current += dvy;
      rotX.current += dvx;
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isDragging.current = false;
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grab";
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useFrame(({ clock }, delta) => {
    if (!meshRef.current) return;

    if (!isDragging.current) {
      // Damping coefficient normalised to 60 fps for frame-rate independence.
      // At DAMPING=0.92 the velocity halves in ~8 frames (~0.13 s at 60 fps).
      const DAMPING = Math.pow(0.92, delta * 60);
      // Threshold below which inertia is considered spent and idle takes over.
      const IDLE_THRESHOLD = 0.0001;

      const hasInertia =
        Math.abs(velX.current) > IDLE_THRESHOLD ||
        Math.abs(velY.current) > IDLE_THRESHOLD;

      if (hasInertia) {
        // Coast with decaying velocity for a smooth, natural stop.
        velX.current *= DAMPING;
        velY.current *= DAMPING;
        rotX.current += velX.current;
        rotY.current += velY.current;
      } else {
        // Resume idle auto-rotation once inertia has settled.
        rotX.current += delta * 0.15;
        rotY.current += delta * 0.25;
      }
    }

    meshRef.current.rotation.x = rotX.current;
    meshRef.current.rotation.y = rotY.current;
    // Vertical float is independent of drag and always runs.
    meshRef.current.position.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.15;
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    isDragging.current = true;
    // Clear any residual velocity so the new drag starts from rest.
    velX.current = 0;
    velY.current = 0;
    lastPointer.current = { x: e.clientX, y: e.clientY };
    if (canvasRef.current) {
      canvasRef.current.style.cursor = "grabbing";
    }
  };

  const handlePointerEnter = () => {
    if (!isDragging.current && canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging.current && canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
  };

  return (
    <mesh
      ref={meshRef}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <torusKnotGeometry args={[1, 0.3, 128, 16, 2, 1]} />
      <meshStandardMaterial color="#6366f1" roughness={0.4} metalness={0.6} />
    </mesh>
  );
}
