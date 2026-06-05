import { useTranslations } from "next-intl";
import type { InsightFeedChannel } from "@portfolio/features/insights/types";

type InsightsProfileHeaderProps = {
  channel: InsightFeedChannel;
};

export function InsightsProfileHeader({ channel }: InsightsProfileHeaderProps) {
  const t = useTranslations("InsightsPage");

  return (
    <div className="rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-7 sm:py-7">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            {t("profileEyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {channel.title}
          </h2>
          <p className="max-w-3xl text-base leading-relaxed text-text-secondary sm:text-lg">
            {channel.description}
          </p>
        </div>

        <a
          href={channel.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-surface-raised px-4 py-2 text-sm font-medium text-text-primary transition-colors duration-200 hover:border-accent hover:text-accent"
        >
          {t("viewBoard")}
        </a>
      </div>
    </div>
  );
}
