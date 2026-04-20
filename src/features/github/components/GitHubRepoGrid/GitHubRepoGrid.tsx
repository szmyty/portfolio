"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Container } from "@portfolio/components/ui/Container";
import { EmptyState } from "@portfolio/components/ui/EmptyState";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import { selectRepositoriesForActiveScope } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import { GitHubRepoCard } from "@portfolio/features/github/components/GitHubRepoCard";
import type { GitHubRepoGridProps } from "./GitHubRepoGrid.types";

type GitHubStoreState = {
  github: GitHubState;
};

export function GitHubRepoGrid(_props: GitHubRepoGridProps) {
  const githubState = useSelector((state: GitHubStoreState) => state.github);
  const repositories = useSelector((state: GitHubStoreState) =>
    selectRepositoriesForActiveScope(state),
  );

  useEffect(() => {
    logGitHubLifecycle("GitHubRepoGrid");
  }, []);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

  useEffect(() => {
    logGitHubDebug("Selected repos:", repositories);
  }, [repositories]);

  if (!repositories.length) {
    return (
      <Container className="max-w-6xl">
        <EmptyState
          title="No repositories available"
          description="There are no repositories to display for the selected GitHub scope yet."
          className="rounded-3xl border border-dashed border-border bg-background/60"
        />
      </Container>
    );
  }

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {repositories.map((repository) => (
          <GitHubRepoCard key={repository.id} repository={repository} />
        ))}
      </div>
    </Container>
  );
}
