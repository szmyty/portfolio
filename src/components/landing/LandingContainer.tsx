import type { ReactNode } from "react";
import { LandingBackground } from "@/components/landing/LandingBackground";

interface LandingContainerProps {
  children: ReactNode;
}

export function LandingContainer({ children }: LandingContainerProps) {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden px-4 sm:px-8 py-16">
      <LandingBackground />
      {children}
    </main>
  );
}
