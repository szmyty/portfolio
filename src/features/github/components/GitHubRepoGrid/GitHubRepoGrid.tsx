"use client";

import { useSelector } from "react-redux";
import { Container } from "@portfolio/components/ui/Container";
import { selectRepositoriesForActiveScope } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import { GitHubRepoCard } from "@portfolio/features/github/components/GitHubRepoCard";
import type { GitHubRepoGridProps } from "./GitHubRepoGrid.types";

type GitHubStoreState = {
  github: GitHubState;
};

export function GitHubRepoGrid(_props: GitHubRepoGridProps) {
  const repositories = useSelector((state: GitHubStoreState) =>
    selectRepositoriesForActiveScope(state),
  );

  return (
    <Container className="max-w-6xl">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {repositories.map((repository) => (
          <GitHubRepoCard key={repository.id} repository={repository} />
        ))}
      </div>
    </Container>
  );
}
