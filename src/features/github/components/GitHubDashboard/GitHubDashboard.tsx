"use client";

import { Section } from "@portfolio/components/ui/Section";
import { GitHubRepoGrid } from "@portfolio/features/github/components/GitHubRepoGrid";
import { GitHubScopeSelector } from "@portfolio/features/github/components/GitHubScopeSelector";
import { GitHubStats } from "@portfolio/features/github/components/GitHubStats";
import type { GitHubDashboardProps } from "./GitHubDashboard.types";

export function GitHubDashboard(_props: GitHubDashboardProps) {
  return (
    <Section
      aria-label="GitHub Dashboard"
      title="GitHub Dashboard"
      background="surface"
      cosmicBackground={false}
      className="py-12 sm:py-16"
    >
      <div className="flex flex-col gap-8">
        <GitHubScopeSelector />
        <GitHubStats />
        <GitHubRepoGrid />
      </div>
    </Section>
  );
}
