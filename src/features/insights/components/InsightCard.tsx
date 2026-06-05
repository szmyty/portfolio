import Image from "next/image";
import { useTranslations } from "next-intl";
import type { InsightPin } from "@portfolio/features/insights/types";

type InsightCardProps = {
  pin: InsightPin;
};

export function InsightCard({ pin }: InsightCardProps) {
  const t = useTranslations("InsightsPage");

  return (
    <a
      href={pin.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border bg-surface transition-all duration-200 hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-raised">
        {pin.imageUrl ? (
          <Image
            src={pin.imageUrl}
            alt={pin.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-surface-raised via-background to-surface px-6 text-center text-sm text-text-muted">
            {t("imageFallback")}
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="space-y-2">
          <h2 className="line-clamp-3 text-lg font-semibold leading-tight text-text-primary">
            {pin.title}
          </h2>
          <p className="line-clamp-4 text-sm leading-relaxed text-text-secondary">
            {pin.description}
          </p>
        </div>

        {pin.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pin.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-surface-raised px-2.5 py-1 text-xs text-text-secondary"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 text-sm text-text-muted">
          <span>
            {pin.publishedAt
              ? new Date(pin.publishedAt).toLocaleDateString()
              : t("dateFallback")}
          </span>
          <span className="font-medium text-accent">{t("viewInsight")}</span>
        </div>
      </div>
    </a>
  );
}
