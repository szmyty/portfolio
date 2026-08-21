import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatDisplayDate } from "@portfolio/lib/format-date";
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
      className="overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-200 hover:border-accent hover:shadow-lg hover:-translate-y-0.5"
    >
      {article.thumbnail && (
        <div className="relative h-48 w-full">
          <Image
            src={article.thumbnail}
            alt={article.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      )}

      <div className="flex flex-col gap-2 p-4">
        <p className="font-semibold leading-tight text-text-primary">
          {article.title}
        </p>

        <p className="line-clamp-3 text-sm text-text-muted">
          {article.description}
        </p>

        <div className="flex justify-between text-xs text-text-muted">
          <span>{t("articleReadTime", { minutes: article.readTime })}</span>
          <span>{formatDisplayDate(article.pubDate)}</span>
        </div>

        {article.categories.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {article.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="rounded-md bg-surface-raised px-2 py-1 text-xs text-text-secondary"
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
