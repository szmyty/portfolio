"use client";

import { useEffect, useRef } from "react";
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
export type UseInfinityInteractionParams = {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  emissiveTargetRef: React.RefObject<number>;

  IDLE_EMISSIVE: number;
  HOVER_EMISSIVE: number;
  ENGAGED_EMISSIVE: number;

  /**
   * Called when a new pointer-down begins (before hold timer).
   * Use to reset velocity / inertia before a fresh drag.
   */
  onPointerDownStart?: () => void;

  /**
   * Called each pointermove while engaged with the pixel deltas.
   * Use to drive rotation or other motion responses.
   */
  onDrag?: (dx: number, dy: number) => void;
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
  onPointerDownStart,
  onDrag,
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
   * Stable refs for optional callbacks — avoids stale closure issues in the
   * window-level effect while keeping the deps array empty.
   */
  const onPointerDownStartRef = useRef(onPointerDownStart);
  const onDragRef = useRef(onDrag);
  onPointerDownStartRef.current = onPointerDownStart;
  onDragRef.current = onDrag;

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
   * Window-level pointer and touch listeners — handle drag movement, release,
   * and scroll cancellation across the full pointer lifecycle.
   */
  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      if (interactionState.current === "pending") {
        // If the pointer moved too far before the hold elapsed, the user is
        // scrolling — cancel the hold so native scroll works unimpeded.
        const dx = Math.abs(e.clientX - initialPointer.current.x);
        const dy = Math.abs(e.clientY - initialPointer.current.y);
        if (dx > SCROLL_CANCEL_PX || dy > SCROLL_CANCEL_PX) {
          cancelHold();
          interactionState.current = "idle";
          if (canvasRef.current) {
            canvasRef.current.style.cursor = isHovered.current
              ? "grab"
              : "default";
          }
        }
        return;
      }

      if (interactionState.current !== "engaged") return;

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      onDragRef.current?.(dx, dy);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Pointer down → begin hold detection.
   */
  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();

    // Clear any existing timer
    if (holdTimer.current !== null) {
      clearTimeout(holdTimer.current);
    }

    // Reset velocity / inertia so the new drag always starts from rest.
    onPointerDownStartRef.current?.();

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