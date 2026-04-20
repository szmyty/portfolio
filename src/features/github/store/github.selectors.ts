import type { GitHubRepository, GitHubScope } from "@portfolio/features/github/types";
import type { GitHubState } from "./github.slice";

export type GitHubSelectorState = GitHubState | { github: GitHubState };

function selectGitHubState(state: GitHubSelectorState): GitHubState {
  return "github" in state ? state.github : state;
}

export function selectActiveScope(state: GitHubSelectorState): GitHubScope | null {
  const githubState = selectGitHubState(state);

  if (!githubState.selectedScopeId) {
    return null;
  }

  return (
    githubState.scopes.find((scope) => scope.id === githubState.selectedScopeId) ?? null
  );
}

export function selectGlobalRepositories(state: GitHubSelectorState): GitHubRepository[] {
  return selectGitHubState(state).scopes.flatMap((scope) => scope.repositories);
}

export function selectRepositoriesForActiveScope(
  state: GitHubSelectorState,
): GitHubRepository[] {
  const activeScope = selectActiveScope(state);

  if (!activeScope) {
    return selectGlobalRepositories(state);
  }

  return activeScope.repositories;
}
