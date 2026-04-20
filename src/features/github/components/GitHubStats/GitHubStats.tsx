"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container } from "@portfolio/components/ui/Container";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import { selectRepositoriesForActiveScope } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubStatsProps } from "./GitHubStats.types";

type GitHubStoreState = {
  github: GitHubState;
};

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <p className="text-sm font-medium text-text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold tracking-tight text-text-primary">{value}</p>
    </div>
  );
}

export function GitHubStats(_props: GitHubStatsProps) {
  const githubState = useSelector((state: GitHubStoreState) => state.github);
  const repositories = useSelector((state: GitHubStoreState) =>
    selectRepositoriesForActiveScope(state),
  );

  const totalRepositories = repositories.length;
  const totalStars = repositories.reduce(
    (sum, repository) => sum + repository.stargazers_count,
    0,
  );
  const uniqueLanguages = new Set(
    repositories.flatMap((repository) => (repository.language ? [repository.language] : [])),
  ).size;

  useEffect(() => {
    logGitHubLifecycle("GitHubStats");
  }, []);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

  useEffect(() => {
    logGitHubDebug("Selected repos:", repositories);
  }, [repositories]);

  if (!repositories.length) {
    return null;
  }

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
        <StatCard label="Repositories" value={totalRepositories} />
        <StatCard label="Stars" value={totalStars} />
        <StatCard label="Languages" value={uniqueLanguages} />
      </div>
    </Container>
  );
}
