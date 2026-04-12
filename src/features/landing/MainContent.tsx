import { Footer } from "@portfolio/features/landing/Footer";
import { NavBar } from "@portfolio/components/ui/NavBar";
import {
  DevelopmentSection,
  HeroSection,
  MusicSection,
  PublishingSection,
} from "./sections";

export function MainContent() {
  return (
    <div className="flex flex-col w-full">
      <header className="sticky top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border">
        <NavBar />
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <HeroSection />
        <MusicSection />
        <PublishingSection />
        <DevelopmentSection />
      </main>
      <Footer />
    </div>
  );
}
