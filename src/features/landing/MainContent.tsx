import { getTranslations } from "next-intl/server";
import { Center } from "@portfolio/components/ui/Center";
import { Container } from "@portfolio/components/ui/Container";
import { Footer } from "@portfolio/components/ui/Footer";
import { Section } from "@portfolio/components/ui/Section";

export async function MainContent() {
  const t = await getTranslations("MainContent");

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        <Center className="min-h-full py-16">
          <Section>
            <Container className="text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary">
                {t("name")}
              </h2>
              <p className="text-base sm:text-lg text-text-secondary">
                {t("tagline")}
              </p>
            </Container>
          </Section>
        </Center>
      </main>
      <Footer />
    </div>
  );
}
