import dynamic from "next/dynamic";

const Scene = dynamic(
  () => import("@portfolio/features/three/Scene").then((mod) => mod.Scene),
  { ssr: false },
);

/**
 * Renders the 3D scene as the decorative background for the landing page.
 *
 * This component is intentionally isolated from layout and gradient concerns
 * so that the visual/animation layer can evolve independently.
 *
 * Scene is loaded via next/dynamic with ssr: false to ensure it only renders
 * on the client, avoiding "window is not defined" errors and hydration mismatches.
 */
export function LandingVisualLayer() {
  return (
    <div className="absolute inset-0">
      <Scene />
    </div>
  );
}
