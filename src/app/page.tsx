import {
  LandingVisualEnhancement,
  MainContent,
} from "@portfolio/features/landing";

export default function Home() {
  return (
    <div className="relative min-h-screen min-h-dvh w-full overflow-x-hidden bg-background">
      <div className="homepage-static-background" aria-hidden="true" />
      <LandingVisualEnhancement />
      <div className="relative z-10 pointer-events-none">
        <MainContent />
      </div>
    </div>
  );
}
