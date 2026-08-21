import {
  LandingVisualEnhancement,
  MainContent,
} from "@portfolio/features/landing";

export default function Home() {
  return (
    <div className="relative min-h-screen min-h-dvh w-full overflow-x-hidden bg-background">
      <div className="homepage-static-background" aria-hidden="true" />
      <LandingVisualEnhancement />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:z-50 focus:top-4 focus:left-4 focus:px-4 focus:py-2 focus:bg-accent focus:text-accent-foreground focus:rounded focus:font-medium"
      >
        Skip to content
      </a>
      <div className="relative z-10 pointer-events-none">
        <MainContent />
      </div>
    </div>
  );
}
