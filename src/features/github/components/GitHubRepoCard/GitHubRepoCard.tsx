"use client";

import type { GitHubRepoCardProps } from "./GitHubRepoCard.types";

export function GitHubRepoCard({ repository }: GitHubRepoCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-border bg-surface px-5 py-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-semibold tracking-tight text-text-primary">
            {repository.name}
          </h3>
          <p className="mt-1 truncate text-sm text-text-muted">{repository.full_name}</p>
        </div>
        <div className="shrink-0 rounded-full border border-border bg-background px-3 py-1 text-sm font-medium text-text-secondary">
          ★ {repository.stargazers_count}
        </div>
      </div>

      <p className="mt-4 flex-1 text-sm leading-6 text-text-secondary">
        {repository.description ?? "No description available."}
      </p>

      <div className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="rounded-full bg-surface-overlay px-3 py-1 text-text-secondary">
          {repository.language ?? "Unspecified"}
        </span>
        <span className="text-text-muted">{new Date(repository.updated_at).toLocaleDateString()}</span>
      </div>
    </article>
  );
}
