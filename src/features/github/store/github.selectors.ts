import { createSelector } from "reselect";
import type { GitHubRepository, GitHubScope } from "@portfolio/features/github/types";
import type { GitHubState } from "./github.slice";

export type GitHubSelectorState = GitHubState | { github: GitHubState };

function selectGitHubState(state: GitHubSelectorState): GitHubState {
  return "github" in state ? state.github : state;
}

const selectScopes = (state: GitHubSelectorState): GitHubScope[] => selectGitHubState(state).scopes;
const selectSelectedScopeId = (state: GitHubSelectorState): string | null =>
  selectGitHubState(state).selectedScopeId;

export const selectActiveScope = createSelector(
  [selectScopes, selectSelectedScopeId],
  (scopes, selectedScopeId): GitHubScope | null => {
    if (!selectedScopeId) {
      return null;
    }

    return scopes.find((scope) => scope.id === selectedScopeId) ?? null;
  },
);

export const selectGlobalRepositories = createSelector(
  [selectScopes],
  (scopes): GitHubRepository[] => scopes.flatMap((scope) => scope.repositories),
);

export const selectRepositoriesForActiveScope = createSelector(
  [selectScopes, selectSelectedScopeId],
  (scopes, selectedScopeId): GitHubRepository[] => {
    if (!selectedScopeId) {
      return scopes.flatMap((scope) => scope.repositories);
    }

    const scope = scopes.find((candidate) => candidate.id === selectedScopeId);
    return scope?.repositories ?? [];
  },
);
