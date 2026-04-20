import { GalaxyBackground } from "@portfolio/components/ui/GalaxyBackground";
import { Footer } from "@portfolio/features/landing/Footer";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";
import type { PageShellProps } from "./PageShell.types";

/**
 * PageShell — shared layout for sub-pages (/music, /development, /publishing, etc.).
 *
 * Uses CosmicBackground in content mode rather than the full LandingBackground
 * (which includes the heavy WebGL canvas). This keeps the cosmic atmosphere
 * consistent with the landing page content sections while avoiding unnecessary
 * 3D overhead on content pages.
 *
 * The background spans the full page height (via `min-h-screen` on the outer
 * container and `absolute inset-0` on CosmicBackground). Content is layered
 * above via z-10.
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen min-h-dvh w-full overflow-x-hidden bg-background flex flex-col">
      <GalaxyBackground />
      <CosmicBackground mode="content" />
      <div className="relative z-10 flex min-h-screen min-h-dvh flex-col">
        <header className="pt-[env(safe-area-inset-top)]">
          <NavBar />
        </header>
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 outline-none"
        >
          <div className="flex flex-col w-full py-16">
            {children}
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
