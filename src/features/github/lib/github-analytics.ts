import type { GitHubRepository, GitHubScope } from "@portfolio/features/github/types";

type CreateGitHubScopeParams = {
  id: string;
  name: string;
  type: "user" | "organization";
  repositories: GitHubRepository[];
};

type BuildGitHubScopesParams = {
  szmyty: GitHubRepository[];
  egohygiene: GitHubRepository[];
  incomprisllc: GitHubRepository[];
};

function createLanguageDistribution(repositories: GitHubRepository[]): Record<string, number> {
  return repositories.reduce<Record<string, number>>((distribution, repository) => {
    const language = repository.language;
    if (!language) {
      return distribution;
    }

    distribution[language] = (distribution[language] ?? 0) + 1;
    return distribution;
  }, {});
}

function createTotalStars(repositories: GitHubRepository[]): number {
  return repositories.reduce((total, repository) => total + repository.stargazers_count, 0);
}

export function createGitHubScope({
  id,
  name,
  type,
  repositories,
}: CreateGitHubScopeParams): GitHubScope {
  return {
    id,
    name,
    type,
    repositories,
    analytics: {
      totalStars: createTotalStars(repositories),
      languageDistribution: createLanguageDistribution(repositories),
    },
  };
}

export function buildGitHubScopes({
  szmyty,
  egohygiene,
  incomprisllc,
}: BuildGitHubScopesParams): GitHubScope[] {
  return [
    createGitHubScope({
      id: "szmyty",
      name: "szmyty",
      type: "user",
      repositories: szmyty,
    }),
    createGitHubScope({
      id: "egohygiene",
      name: "egohygiene",
      type: "organization",
      repositories: egohygiene,
    }),
    createGitHubScope({
      id: "incomprisllc",
      name: "incomprisllc",
      type: "organization",
      repositories: incomprisllc,
    }),
  ];
}
