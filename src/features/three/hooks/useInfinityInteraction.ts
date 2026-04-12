"use client";

import { useRef } from "react";
import type { ThreeEvent } from "@react-three/fiber";

/**
 * Duration (ms) the pointer must be held before drag activates.
 * Prevents accidental drags when user intends to scroll.
 */
const HOLD_THRESHOLD_MS = 250;

/**
 * Max pointer movement (px) allowed during hold before cancelling.
 * If exceeded → treat as scroll instead of interaction.
 */
const SCROLL_CANCEL_PX = 8;

/**
 * Finite state machine for interaction lifecycle.
 */
export type InteractionState = "idle" | "pending" | "engaged";

/**
 * Parameters injected from InfinityObject.
 * Keeps this hook stateless and reusable.
 */
export interface UseInfinityInteractionParams {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  emissiveTargetRef: React.RefObject<number>;

  IDLE_EMISSIVE: number;
  HOVER_EMISSIVE: number;
  ENGAGED_EMISSIVE: number;
}

/**
 * useInfinityInteraction
 *
 * Handles:
 * - pointer lifecycle
 * - hold-to-engage logic
 * - hover feedback
 * - cursor state
 *
 * Does NOT handle:
 * - motion / rotation (separate concern)
 */
export function useInfinityInteraction({
  canvasRef,
  emissiveTargetRef,
  IDLE_EMISSIVE,
  HOVER_EMISSIVE,
  ENGAGED_EMISSIVE,
}: UseInfinityInteractionParams) {
  /**
   * Current interaction mode.
   */
  const interactionState = useRef<InteractionState>("idle");

  /**
   * Timer for hold-to-engage logic.
   */
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Pointer tracking
   */
  const lastPointer = useRef({ x: 0, y: 0 });
  const initialPointer = useRef({ x: 0, y: 0 });

  /**
   * Hover state (separate from interaction state)
   */
  const isHovered = useRef(false);

  /**
   * Cancels any active hold timer.
   */
  const cancelHold = () => {
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  /**
   * Resets interaction back to idle.
   * Called on pointer release.
   */
  const releaseEngaged = () => {
    cancelHold();

    interactionState.current = "idle";

    if (canvasRef.current) {
      canvasRef.current.style.cursor = isHovered.current
        ? "grab"
        : "default";
    }

    // Smoothly return emissive to hover/idle level
    emissiveTargetRef.current = isHovered.current
      ? HOVER_EMISSIVE
      : IDLE_EMISSIVE;
  };

  /**
   * Pointer down → begin hold detection.
   */
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // Clear any existing timer
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
    }

    // Capture initial pointer position
    initialPointer.current = { x: e.clientX, y: e.clientY };
    lastPointer.current = { x: e.clientX, y: e.clientY };

    interactionState.current = "pending";

    /**
     * After HOLD_THRESHOLD → activate drag mode
     */
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;

      interactionState.current = "engaged";

      if (canvasRef.current) {
        canvasRef.current.style.cursor = "grabbing";
      }

      emissiveTargetRef.current = ENGAGED_EMISSIVE;
    }, HOLD_THRESHOLD_MS);
  };

  /**
   * Hover enter → visual feedback only
   */
  const handlePointerEnter = () => {
    isHovered.current = true;

    if (interactionState.current === "idle" && canvasRef.current) {
      canvasRef.current.style.cursor = "grab";
    }

    emissiveTargetRef.current = HOVER_EMISSIVE;
  };

  /**
   * Hover leave → revert visuals (unless dragging)
   */
  const handlePointerLeave = () => {
    isHovered.current = false;

    if (interactionState.current === "idle" && canvasRef.current) {
      canvasRef.current.style.cursor = "default";
    }

    if (interactionState.current !== "engaged") {
      emissiveTargetRef.current = IDLE_EMISSIVE;
    }
  };

  return {
    interactionState,
    isHovered,
    lastPointer,
    initialPointer,
    cancelHold,
    releaseEngaged,
    handlePointerDown,
    handlePointerEnter,
    handlePointerLeave,
    SCROLL_CANCEL_PX,
  };
}