import { Center } from "@portfolio/components/ui/Center";
import { Container } from "@portfolio/components/ui/Container";
import { Section } from "@portfolio/components/ui/Section";

export function MainContent() {
  return (
    <main>
      <Center className="min-h-screen">
        <Section>
          <Container className="text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
              Alan Szmyt
            </h2>
            <p className="text-base sm:text-lg text-text-secondary">
              Software engineer focused on building thoughtful, reliable systems.
            </p>
          </Container>
        </Section>
      </Center>
    </main>
  );
}
