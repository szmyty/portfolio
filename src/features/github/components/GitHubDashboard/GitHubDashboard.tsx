"use client";

import { Section } from "@portfolio/components/ui/Section";
import { GitHubLanguageChart } from "@portfolio/features/github/components/GitHubLanguageChart";
import { GitHubProfileHeader } from "@portfolio/features/github/components/GitHubProfileHeader";
import { GitHubRepoGrid } from "@portfolio/features/github/components/GitHubRepoGrid";
import { GitHubScopeSelector } from "@portfolio/features/github/components/GitHubScopeSelector";
import { GitHubStarsChart } from "@portfolio/features/github/components/GitHubStarsChart";
import { GitHubStats } from "@portfolio/features/github/components/GitHubStats";
import type { GitHubDashboardProps } from "./GitHubDashboard.types";

export function GitHubDashboard(_props: GitHubDashboardProps) {
  return (
    <Section
      aria-label="GitHub Dashboard"
      title="GitHub Dashboard"
      background="surface"
      cosmicBackground={false}
      className="py-10 sm:py-14 lg:py-16"
      contentClassName="max-w-6xl gap-8 lg:gap-10"
    >
      <div className="flex flex-col gap-10 lg:gap-12">
        <div className="flex flex-col gap-5 sm:gap-6">
          <GitHubProfileHeader />
          <div className="rounded-3xl border border-border/80 bg-background/50 p-3 shadow-sm backdrop-blur-sm sm:p-4">
            <GitHubScopeSelector />
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:gap-8">
          <GitHubStats />
          <div className="grid gap-6 xl:grid-cols-2">
            <GitHubLanguageChart />
            <GitHubStarsChart />
          </div>
        </div>

        <GitHubRepoGrid />
      </div>
    </Section>
  );
}
