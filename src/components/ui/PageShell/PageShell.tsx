import type { ReactNode } from "react";
import { Center } from "@portfolio/components/ui/Center";
import { Footer } from "@portfolio/features/landing/Footer";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";

type PageShellProps = {
  children: ReactNode;
}

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
    <div className="relative min-h-screen min-h-dvh w-full overflow-hidden bg-background">
      <CosmicBackground mode="content" />
      <div className="absolute inset-0 z-10 flex flex-col">
        <header className="pt-[env(safe-area-inset-top)]">
          <NavBar />
        </header>
        <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
          <Center className="min-h-full py-16">{children}</Center>
        </main>
        <Footer />
      </div>
    </div>
  );
}
