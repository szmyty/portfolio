import { Footer } from "@portfolio/features/landing/Footer";
import { GalaxyBackground } from "@portfolio/components/ui/GalaxyBackground";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { SharedSectionVisualCanvas } from "@portfolio/features/landing/sections/shared/SharedSectionVisualCanvas";
import {
  DevelopmentSection,
  HeroSection,
  MusicSection,
  PublishingSection,
} from "@portfolio/features/landing/sections";

/**
 * MainContent — post-entry UI overlay (layer 2, z-10).
 *
 * Pointer-event layering within this component follows the system defined by
 * the --z-* tokens in globals.css:
 *   • The parent motion.div in LandingEntry sets pointer-events: none on the
 *     layer-2 container, allowing 3D canvas events to pass through unblocked.
 *   • The sticky header (layer 3 / --z-chrome) restores pointer-events-auto
 *     so navigation is always reachable regardless of scroll position.
 *   • The <main> element preserves pointer-events: none so the canvas behind
 *     the hero section stays interactive; individual sections and their
 *     interactive children restore pointer-events-auto as needed.
 */
export function MainContent() {
  return (
    <div className="flex flex-col w-full">
      <GalaxyBackground />
      {/* Layer 3 — chrome: sticky header is always interactive.
           pt-[env(safe-area-inset-top)] pads the header content below the device
           notch/status bar when viewport-fit=cover is active (e.g. PWA mode on
           iOS). On standard browser visits the inset is 0 so no extra padding
           is applied. */}
      <header
        className="fixed inset-x-0 top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border pointer-events-auto pt-[env(safe-area-inset-top)]"
      >
        <NavBar />
      </header>
      {/* Layer 2 — UI overlay: pointer-events-none on container; sections restore as needed */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none pointer-events-none pt-[calc(env(safe-area-inset-top)+4.5rem)] sm:pt-[calc(env(safe-area-inset-top)+5rem)]"
      >
        <SharedSectionVisualCanvas />
        <HeroSection />
        <MusicSection />
        <PublishingSection />
        <DevelopmentSection />
      </main>
      <Footer />
    </div>
  );
}
