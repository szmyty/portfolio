"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Section } from "@portfolio/components/ui/Section";
import { GitHubLanguageChart } from "@portfolio/features/github/components/GitHubLanguageChart";
import { GitHubProfileHeader } from "@portfolio/features/github/components/GitHubProfileHeader";
import { GitHubRepoGrid } from "@portfolio/features/github/components/GitHubRepoGrid";
import { GitHubScopeSelector } from "@portfolio/features/github/components/GitHubScopeSelector";
import { GitHubStarsChart } from "@portfolio/features/github/components/GitHubStarsChart";
import { GitHubStats } from "@portfolio/features/github/components/GitHubStats";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubDashboardProps } from "./GitHubDashboard.types";

type GitHubStoreState = {
  github: GitHubState;
};

export function GitHubDashboard(_props: GitHubDashboardProps) {
  const githubState = useSelector((state: GitHubStoreState) => state.github);

  useEffect(() => {
    logGitHubLifecycle("GitHubDashboard");
  }, []);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

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
          <div className="grid items-stretch gap-6 xl:grid-cols-2">
            <div className="min-w-0 min-h-[320px]">
              <GitHubLanguageChart />
            </div>
            <div className="min-w-0 min-h-[320px]">
              <GitHubStarsChart />
            </div>
          </div>
        </div>

        <GitHubRepoGrid />
      </div>
    </Section>
  );
}
