import type { ReactNode } from "react";
import { Center } from "@portfolio/components/ui/Center";
import { Footer } from "@portfolio/features/landing/Footer";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { LandingBackground } from "@portfolio/features/landing/LandingBackground";

interface PageShellProps {
  children: ReactNode;
}

export function PageShell({ children }: PageShellProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      <LandingBackground />
      <div className="absolute inset-0 z-10 flex flex-col">
        <header>
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
