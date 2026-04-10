import type { ReactNode } from "react";

interface LandingContainerProps {
  children: ReactNode;
}

export function LandingContainer({ children }: LandingContainerProps) {
  return (
    <main className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      {children}
    </main>
  );
}
