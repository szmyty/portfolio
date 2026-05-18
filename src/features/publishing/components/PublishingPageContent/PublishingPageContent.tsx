import { useTranslations } from "next-intl";
import { PublishingArticlesSection } from "@portfolio/features/publishing/components/PublishingArticlesSection";
import { PublishingComicsSection } from "@portfolio/features/publishing/components/PublishingComicsSection";
import type { PublishingPageContentProps } from "./PublishingPageContent.types";

export function PublishingPageContent({
  articles,
}: PublishingPageContentProps) {
  const t = useTranslations("PublishingPage");

  return (
    <section className="flex w-full max-w-6xl flex-col gap-12 px-4 sm:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
        {t("title")}
      </h1>

      <PublishingComicsSection />
      <PublishingArticlesSection articles={articles} />
    </section>
  );
}
