"use client";

import { useTranslations } from "next-intl";
import { formatDisplayDate } from "@portfolio/lib/format-date";
import type { GitHubRepoCardProps } from "./GitHubRepoCard.types";

export function GitHubRepoCard({ repository }: GitHubRepoCardProps) {
  const t = useTranslations("GitHub");

  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface px-5 py-5 shadow-sm transition-all duration-200 hover:border-accent hover:shadow-lg sm:px-6 sm:py-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <a
            href={`https://github.com/${repository.full_name}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <h3 className="truncate text-lg font-semibold tracking-tight text-text-primary hover:underline">
              {repository.name}
            </h3>
            <p className="mt-1 truncate text-sm text-text-muted hover:underline">
              {repository.full_name}
            </p>
          </a>
        </div>
        <a
          href={`https://github.com/${repository.full_name}/stargazers`}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-text-secondary transition-colors duration-200 hover:border-accent hover:text-text-primary"
        >
          ★ {repository.stargazers_count}
        </a>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-text-secondary">
        {repository.description ?? t("repoCard.noDescription")}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="rounded-full bg-surface-overlay px-3 py-1 text-text-secondary">
          {repository.language ?? t("repoCard.unspecifiedLanguage")}
        </span>
        <span className="text-text-muted">
          {formatDisplayDate(repository.updated_at)}
        </span>
      </div>
    </article>
  );
}
