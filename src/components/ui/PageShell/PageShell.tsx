import { GalaxyBackground } from "@portfolio/components/ui/GalaxyBackground";
import { CosmicBackground } from "@portfolio/components/ui/CosmicBackground";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { Footer } from "@portfolio/features/landing/Footer";
import type { PageShellProps } from "./PageShell.types";

/**
 * PageShell — shared layout for sub-pages (/music, /development, /publishing).
 *
 * Handles:
 * - background layering
 * - navigation + footer
 * - main content framing
 */
export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen min-h-dvh w-full overflow-x-hidden bg-background flex flex-col">
      <PageShellBackground />

      <PageShellLayout>
        <PageShellMain>{children}</PageShellMain>
      </PageShellLayout>
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Background Layer
 * -----------------------------------------------------------------------------------------------*/

function PageShellBackground() {
  return (
    <>
      <GalaxyBackground />
      <CosmicBackground mode="content" />
    </>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Layout Layer (Nav + Footer)
 * -----------------------------------------------------------------------------------------------*/

type PageShellLayoutProps = {
  children: React.ReactNode;
};

function PageShellLayout({ children }: PageShellLayoutProps) {
  return (
    <div className="relative z-10 flex min-h-screen min-h-dvh flex-col">
      <header className="pt-[env(safe-area-inset-top)]">
        <NavBar />
      </header>

      {children}

      <Footer />
    </div>
  );
}

/* -------------------------------------------------------------------------------------------------
 * Main Content
 * -----------------------------------------------------------------------------------------------*/

type PageShellMainProps = {
  children: React.ReactNode;
};

function PageShellMain({ children }: PageShellMainProps) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex-1 outline-none bg-background"
    >
      <div className="flex flex-col w-full py-16">
        {children}
      </div>
    </main>
  );
}