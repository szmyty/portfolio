import { useTranslations } from "next-intl";
import type { PublishingArticleCardProps } from "./PublishingArticleCard.types";

export function PublishingArticleCard({
  article,
}: PublishingArticleCardProps) {
  const t = useTranslations("PublishingPage");

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noopener noreferrer"
      className="overflow-hidden rounded-2xl border transition-all duration-200 hover:shadow-lg"
    >
      {article.thumbnail && (
        <img
          src={article.thumbnail}
          alt={article.title}
          className="h-48 w-full object-cover"
        />
      )}

      <div className="flex flex-col gap-2 p-4">
        <p className="font-semibold leading-tight text-text-primary">
          {article.title}
        </p>

        <p className="line-clamp-3 text-sm text-muted-foreground">
          {article.description}
        </p>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{t("articleReadTime", { minutes: article.readTime })}</span>
          <span>{new Date(article.pubDate).toLocaleDateString()}</span>
        </div>

        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {article.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="rounded-md bg-muted px-2 py-1 text-xs"
              >
                {category}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
