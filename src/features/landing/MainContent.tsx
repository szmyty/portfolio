import { Center } from "@portfolio/components/ui/Center";
import { Footer } from "@portfolio/features/landing/Footer";
import { NavBar } from "@portfolio/components/ui/NavBar";
import { Section } from "@portfolio/components/ui/Section";
import { UnderConstruction } from "@portfolio/components/ui/UnderConstruction";

export function MainContent() {
  return (
    <div className="flex flex-col min-h-screen">
      <header>
        <NavBar />
      </header>
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        <Center className="min-h-full py-16">
          <Section>
            <UnderConstruction />
          </Section>
        </Center>
      </main>
      <Footer />
    </div>
  );
}
