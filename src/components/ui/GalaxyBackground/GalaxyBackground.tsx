/**
 * A dependency-free atmosphere for sub-pages.
 *
 * The previous implementation opened a permanent WebGL context and downloaded
 * a 30 MB EXR on every sub-page. Layered CSS gradients preserve the visual
 * identity while keeping content complete when JavaScript or WebGL is absent.
 */
export function GalaxyBackground() {
  return (
    <div
      aria-hidden="true"
      data-visual-mode="static"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background"
    >
      <div className="galaxy-static-atmosphere absolute inset-0" />
      <div className="absolute inset-0 bg-background/45" />
    </div>
  );
}
