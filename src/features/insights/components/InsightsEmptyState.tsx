import { useTranslations } from "next-intl";
import type { InsightFeedState } from "@portfolio/features/insights/types";

type InsightsEmptyStateProps = {
  state: InsightFeedState;
};

export function InsightsEmptyState({ state }: InsightsEmptyStateProps) {
  const t = useTranslations("InsightsPage");
  const isError = state === "error";

  return (
    <div className="rounded-3xl border border-dashed border-border bg-surface/80 px-6 py-12 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-text-primary">
        {isError ? t("errorTitle") : t("emptyTitle")}
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-text-secondary">
        {isError ? t("errorDescription") : t("emptyDescription")}
      </p>
    </div>
  );
}
