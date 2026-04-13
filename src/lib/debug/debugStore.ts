/**
 * Lightweight module-level debug store for development tooling.
 *
 * This module is only meaningfully used in development mode. Writers (3D
 * components) update values each frame; readers (DebugPanel) poll at a lower
 * frequency so there is no React re-render pressure on the hot path.
 *
 * IMPORTANT: Never import this in production-critical code paths.
 * It is tree-shaken away when NODE_ENV !== "development" because the
 * DebugPanel itself is conditionally rendered only in dev.
 */

import type { InteractionState } from "@portfolio/features/three/hooks/useInfinityInteraction";

export type { InteractionState };

export type DebugInteractionData = {
  interactionState: InteractionState;
  isHovered: boolean;
};

const _interaction: DebugInteractionData = {
  interactionState: "idle",
  isHovered: false,
};

export function setDebugInteraction(patch: Partial<DebugInteractionData>): void {
  Object.assign(_interaction, patch);
}

export function getDebugInteraction(): DebugInteractionData {
  return { ..._interaction };
}
