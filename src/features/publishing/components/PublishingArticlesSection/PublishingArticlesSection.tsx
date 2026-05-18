import { useTranslations } from "next-intl";
import { PublishingArticleCard } from "@portfolio/features/publishing/components/PublishingArticleCard";
import type { PublishingArticlesSectionProps } from "./PublishingArticlesSection.types";

export function PublishingArticlesSection({
  articles,
}: PublishingArticlesSectionProps) {
  const t = useTranslations("PublishingPage");

  return (
    <section className="flex flex-col gap-6" aria-labelledby="publishing-articles-title">
      <h2
        id="publishing-articles-title"
        className="text-2xl font-semibold text-text-primary"
      >
        {t("articlesTitle")}
      </h2>

      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <PublishingArticleCard key={article.link} article={article} />
        ))}
      </div>
    </section>
  );
}
