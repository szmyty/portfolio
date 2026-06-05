import { useTranslations } from "next-intl";
import { InsightCard } from "@portfolio/features/insights/components/InsightCard";
import { InsightsEmptyState } from "@portfolio/features/insights/components/InsightsEmptyState";
import { InsightsProfileHeader } from "@portfolio/features/insights/components/InsightsProfileHeader";
import type { InsightFeed } from "@portfolio/features/insights/types";

type InsightsPageContentProps = {
  feed: InsightFeed;
};

export function InsightsPageContent({ feed }: InsightsPageContentProps) {
  const t = useTranslations("InsightsPage");

  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 sm:px-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {t("title")}
        </h1>
        <p className="max-w-3xl text-base text-text-secondary sm:text-lg">
          {t("description")}
        </p>
      </header>

      <InsightsProfileHeader channel={feed.channel} />

      {feed.items.length > 0 ? (
        <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {feed.items.map((pin) => (
            <InsightCard key={pin.id} pin={pin} />
          ))}
        </section>
      ) : (
        <InsightsEmptyState state={feed.state} />
      )}
    </section>
  );
}
