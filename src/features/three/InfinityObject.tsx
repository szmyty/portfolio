"use client";

import { useEffect, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import type { ComponentType, ReactNode } from "react";
import type { Mesh, MeshStandardMaterial } from "three";
import { TorusKnotGeometry } from "./geometry";
import { StandardMaterial } from "./materials";
import type { MaterialProps } from "./materials";
import type { EffectLayerProps } from "./effects";

/** Duration in ms the pointer must be held before drag interaction activates. */
const HOLD_THRESHOLD_MS = 250;

/**
 * Pointer travel in CSS pixels during the hold phase that cancels the hold
 * and allows the native scroll gesture to proceed unobstructed.
 */
const SCROLL_CANCEL_PX = 8;

export interface InfinityObjectProps {
  /**
   * Geometry layer — any component that renders a Three.js geometry element.
   * Defaults to TorusKnotGeometry (p=2, q=1 infinity-like shape).
   * Swap for a custom infinity-curve geometry without touching any other layer.
   */
  GeometryComponent?: ComponentType;

  /**
   * Material layer — any component that accepts a `matRef` and renders a
   * Three.js material element.
   * Defaults to StandardMaterial (PBR, indigo accent).
   * Swap for a shader-based material without touching any other layer.
   */
  MaterialComponent?: ComponentType<MaterialProps>;

  /**
   * Effect layer hook points for future effects (glow, particles, trails).
   * None are rendered yet; this prop surface keeps the API stable.
   */
  effects?: EffectLayerProps;

  /**
   * Additional Three.js scene objects (e.g. point lights, helpers) to render
   * as siblings of the mesh inside the same group.
   */
  children?: ReactNode;
}

/**
 * InfinityObject is the top-level composition component for the 3D identity
 * object. It wires together three independently replaceable layers:
 *
 *   Geometry  → shape of the object (torusKnot by default)
 *   Material  → surface appearance (PBR standard by default)
 *   Effects   → post-processing / particle hooks (future-ready, not yet rendered)
 *
 * Interaction model (identical to the original InfinityKnot baseline):
 *   1. Default (passive)  – idle rotation + float; page scroll is unaffected.
 *   2. Hover / touch cue  – cursor changes to "grab", subtle emissive glow grows.
 *   3. Pending (hold)     – pointer down starts a HOLD_THRESHOLD_MS timer;
 *                           if the pointer moves more than SCROLL_CANCEL_PX the
 *                           hold is cancelled and native scroll takes over.
 *   4. Engaged (active)   – hold threshold elapsed; drag rotates the object and
 *                           touch-scroll is suppressed for the gesture duration.
 *   5. Release            – inertia coasts with damping; idle resumes seamlessly.
 *
 * Accessibility: respects prefers-reduced-motion by disabling idle rotation and
 * the sinusoidal float when the user has requested reduced motion.
 */
export function InfinityObject({
  GeometryComponent = TorusKnotGeometry,
  MaterialComponent = StandardMaterial,
  // effects and children reserved for future use
}: InfinityObjectProps) {
  const meshRef = useRef<Mesh>(null);
  const matRef = useRef<MeshStandardMaterial>(null);

  // Accumulated rotation in radians; mutated each frame or on drag.
  const rotX = useRef(0);
  const rotY = useRef(0);

  // Per-frame rotation velocity applied after drag release for inertia.
  const velX = useRef(0);
  const velY = useRef(0);

  // Three-state interaction: 'idle' → 'pending' (hold timer running) → 'engaged' (drag active).
  const interactionState = useRef<"idle" | "pending" | "engaged">("idle");
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pointer positions — plain refs avoid re-renders on every pointer event.
  const lastPointer = useRef({ x: 0, y: 0 });
  const initialPointer = useRef({ x: 0, y: 0 });

  // Whether the pointer is currently hovering the mesh.
  const isHovered = useRef(false);

  // Target emissive intensity lerped toward each frame for a smooth glow.
  const emissiveTarget = useRef(0);

  // Store the canvas element in a ref so event handlers can mutate its style
  // without the linter treating it as an immutable hook return value.
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { gl } = useThree();

  // Detect prefers-reduced-motion once on mount.
  const reducedMotion = useRef(false);
  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
  }, []);

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [gl]);

  // Window-level pointer and touch listeners — kept in a single effect so the
  // same cancelHold / releaseEngaged helpers are shared by all handlers.
  useEffect(() => {
    const cancelHold = () => {
      if (holdTimer.current !== null) {
        clearTimeout(holdTimer.current);
        holdTimer.current = null;
      }
    };

    const releaseEngaged = () => {
      cancelHold();
      interactionState.current = "idle";
      if (canvasRef.current) {
        canvasRef.current.style.cursor = isHovered.current ? "grab" : "default";
      }
      emissiveTarget.current = isHovered.current ? 0.4 : 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (interactionState.current === "pending") {
        // If the pointer moved too far before the hold elapsed, the user is
        // scrolling — cancel the hold so native scroll works unimpeded.
        const dx = Math.abs(e.clientX - initialPointer.current.x);
        const dy = Math.abs(e.clientY - initialPointer.current.y);
        if (dx > SCROLL_CANCEL_PX || dy > SCROLL_CANCEL_PX) {
          cancelHold();
          interactionState.current = "idle";
        }
        return;
      }

      if (interactionState.current !== "engaged") return;

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
      releaseEngaged();
    };

    // Prevent touch-scroll only while actively dragging the object.
    // Must be registered as non-passive so preventDefault() is honoured.
    const preventTouchScroll = (e: TouchEvent) => {
      if (interactionState.current === "engaged") {
        e.preventDefault();
      }
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    document.addEventListener("touchmove", preventTouchScroll, {
      passive: false,
    });

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("touchmove", preventTouchScroll);
      // Ensure no dangling timer if the component unmounts mid-hold.
      if (holdTimer.current !== null) {
        clearTimeout(holdTimer.current);
      }
    };
  }, []);

  useFrame(({ clock, viewport }, delta) => {
    if (!meshRef.current) return;

    const isEngaged = interactionState.current === "engaged";

    if (!isEngaged) {
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
      } else if (!reducedMotion.current) {
        // Resume idle auto-rotation once inertia has settled.
        rotX.current += delta * 0.15;
        rotY.current += delta * 0.25;
      }
    }

    // Compute viewport-proportional offsets so the object stays clear of the
    // centred text on all screen sizes.
    //   - Landscape (desktop/tablet): shift to lower-right quadrant.
    //   - Portrait (mobile): shift to lower-centre to stay below the heading.
    const isLandscape = viewport.width >= viewport.height;
    const baseX = isLandscape ? viewport.width * 0.28 : viewport.width * 0.08;
    const baseY = isLandscape
      ? viewport.height * -0.18
      : viewport.height * -0.32;

    meshRef.current.rotation.x = rotX.current;
    meshRef.current.rotation.y = rotY.current;
    meshRef.current.position.x = baseX;
    // Vertical float is independent of drag. Disabled when reduced motion is on.
    meshRef.current.position.y = reducedMotion.current
      ? baseY
      : baseY + Math.sin(clock.getElapsedTime() * 0.5) * 0.15;

    // Smooth scale: 1.0 idle → 1.05 hovered → 1.08 engaged.
    const targetScale = isEngaged ? 1.08 : isHovered.current ? 1.05 : 1.0;
    const currentNorm = meshRef.current.scale.x / 0.7;
    const newNorm =
      currentNorm + (targetScale - currentNorm) * Math.min(delta * 8, 1);
    meshRef.current.scale.setScalar(0.7 * newNorm);

    // Smooth emissive glow lerp toward the target set by pointer events.
    if (matRef.current) {
      const cur = matRef.current.emissiveIntensity;
      matRef.current.emissiveIntensity =
        cur + (emissiveTarget.current - cur) * Math.min(delta * 6, 1);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    // Clear any prior hold timer (e.g. rapid repeated presses).
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
    }
    // Reset velocity so the new drag always starts from rest.
    velX.current = 0;
    velY.current = 0;
    initialPointer.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = { x: e.clientX, y: e.clientY };
    interactionState.current = "pending";

    // After the hold threshold, transition to the engaged (drag-active) state.
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      interactionState.current = "engaged";
      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }
      emissiveTarget.current = 0.8;
    }, HOLD_THRESHOLD_MS);
  };

  const handlePointerEnter = () => {
    isHovered.current = true;
    if (interactionState.current === "idle" && canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }
    emissiveTarget.current = 0.4;
  };

  const handlePointerLeave = () => {
    isHovered.current = false;
    if (interactionState.current === "idle" && canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }
    // Keep glow while actively dragging; fade out otherwise.
    if (interactionState.current !== "engaged") {
      emissiveTarget.current = 0;
    }
  };

  return (
    <mesh
      ref={meshRef}
      scale={0.7}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <GeometryComponent />
      <MaterialComponent matRef={matRef} />
    </mesh>
  );
}
