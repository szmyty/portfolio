import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("@portfolio/features/three/scenes").then((mod) => mod.Scene),
  { ssr: false },
);

/**
 * Renders the 3D scene as the interactive canvas layer for the landing page.
 *
 * This component sits at layer 1 (--z-canvas) in the pointer-event stack:
 *   - Background (layer 0) is non-interactive (pointer-events: none).
 *   - 3D canvas (layer 1) is interactive (pointer-events: auto) — this layer.
 *   - UI overlay (layer 2) has pointer-events: none on its container so events
 *     fall through to the canvas for drag / hover interactions.
 *
 * Scene is loaded via next/dynamic with ssr: false to ensure it only renders
 * on the client, avoiding "window is not defined" errors and hydration mismatches.
 *
 * This component is intentionally isolated from layout and gradient concerns
 * so that the visual/animation layer can evolve independently.
 */
export function LandingVisualLayer() {
  return (
    /* Layer 1 — 3D canvas: pointer-events-auto so WebGL receives input. */
    <div className="absolute inset-0 z-[1] pointer-events-auto">
      <Scene />
    </div>
  );
}
