import { createSelector } from "reselect";
import type { GitHubRepository, GitHubScope } from "@portfolio/features/github/types";
import type { GitHubState } from "./github.slice";

export type GitHubSelectorState = GitHubState | { github: GitHubState };
type ChartDatum = { name: string; value: number };
type TreemapDatum = { name: string; size: number; fill: string };

function selectGitHubState(state: GitHubSelectorState): GitHubState {
  return "github" in state ? state.github : state;
}

const selectScopes = (state: GitHubSelectorState): GitHubScope[] => selectGitHubState(state).scopes;
const selectSelectedScopeId = (state: GitHubSelectorState): string | null =>
  selectGitHubState(state).selectedScopeId;
const SCOPE_ORDER: Record<string, number> = {
  egohygiene: 0,
  incomprisllc: 1,
  szmyty: 2,
};

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

export const selectSortedScopes = createSelector(
  [selectScopes],
  (scopes): GitHubScope[] =>
    [...scopes].sort((left, right) => {
      const leftOrder = SCOPE_ORDER[left.id] ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = SCOPE_ORDER[right.id] ?? Number.MAX_SAFE_INTEGER;

      if (leftOrder !== rightOrder) {
        return leftOrder - rightOrder;
      }

      return left.name.localeCompare(right.name);
    }),
);

export const selectLanguageChartData = createSelector(
  [selectRepositoriesForActiveScope],
  (repositories): ChartDatum[] => {
    const distribution = repositories.reduce<Record<string, number>>((languages, repository) => {
      if (!repository.language) {
        return languages;
      }

      languages[repository.language] = (languages[repository.language] ?? 0) + 1;
      return languages;
    }, {});

    return Object.entries(distribution)
      .map(([name, value]) => ({ name, value }))
      .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
  },
);

export const selectStarsChartData = createSelector(
  [selectRepositoriesForActiveScope],
  (repositories): ChartDatum[] =>
    repositories
      .slice()
      .sort((left, right) => {
        if (right.stargazers_count !== left.stargazers_count) {
          return right.stargazers_count - left.stargazers_count;
        }

        return left.name.localeCompare(right.name);
      })
      .slice(0, 6)
      .map((repository) => ({
        name: repository.name,
        value: repository.stargazers_count,
      })),
);

const TREEMAP_COLORS = [
  "#7c9cff",
  "#5ec2b7",
  "#c084fc",
  "#f59e0b",
  "#f97373",
  "#38bdf8",
  "#a3e635",
  "#fb7185",
  "#818cf8",
  "#34d399",
] as const;

export const selectGlobalLanguageTreemapData = createSelector(
  [selectScopes],
  (scopes): TreemapDatum[] => {
    const distribution: Record<string, number> = {};

    for (const scope of scopes) {
      for (const repository of scope.repositories) {
        if (!repository.language) continue;
        distribution[repository.language] = (distribution[repository.language] ?? 0) + 1;
      }
    }

    return Object.entries(distribution)
      .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
      .map(([name, size], index) => ({
        name,
        size,
        fill: TREEMAP_COLORS[index % TREEMAP_COLORS.length] as string,
      }));
  },
);
