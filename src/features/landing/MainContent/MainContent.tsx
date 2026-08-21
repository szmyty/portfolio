import { AppNavBar } from "@portfolio/components/app/AppNavBar";
import { Footer } from "@portfolio/features/landing/Footer";
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
 *   • The homepage shell sets pointer-events: none on the layer-2 container,
 *     allowing an optional 3D canvas to receive input without gating content.
 *   • The sticky header (layer 3 / --z-chrome) restores pointer-events-auto
 *     so navigation is always reachable regardless of scroll position.
 *   • The <main> element preserves pointer-events: none so the canvas behind
 *     the hero section stays interactive; individual sections and their
 *     interactive children restore pointer-events-auto as needed.
 */
export function MainContent() {
  return (
    <div className="flex flex-col w-full">
      {/* Layer 3 — chrome: sticky header is always interactive.
           pt-[env(safe-area-inset-top)] pads the header content below the device
           notch/status bar when viewport-fit=cover is active (e.g. PWA mode on
           iOS). On standard browser visits the inset is 0 so no extra padding
           is applied. */}
      <header
        className="site-header fixed inset-x-0 top-0 z-20 bg-background/80 backdrop-blur-sm border-b border-border pointer-events-auto"
      >
        <AppNavBar />
      </header>
      {/* Layer 2 — UI overlay: pointer-events-none on container; sections restore as needed */}
      <main
        id="main-content"
        tabIndex={-1}
        className="flex-1 outline-none pointer-events-none pt-[calc(env(safe-area-inset-top)+4.5rem)] sm:pt-[calc(env(safe-area-inset-top)+5rem)]"
      >
        <HeroSection />
        <MusicSection />
        <PublishingSection />
        <DevelopmentSection />
      </main>
      <Footer />
    </div>
  );
}
