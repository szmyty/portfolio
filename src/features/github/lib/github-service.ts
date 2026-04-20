import type { GitHubRepository } from "@portfolio/features/github/types";

const GITHUB_API_BASE_URL = "https://api.github.com";

type GitHubRepositoryApiResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
};

function mapGitHubRepository(repository: GitHubRepositoryApiResponse): GitHubRepository {
  return {
    id: repository.id,
    name: repository.name,
    full_name: repository.full_name,
    description: repository.description,
    stargazers_count: repository.stargazers_count,
    language: repository.language,
    updated_at: repository.updated_at,
  };
}

async function fetchGitHubApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GITHUB_API_BASE_URL}${endpoint}`, {
    headers: {
      Accept: "application/vnd.github+json",
    },
  });

  if (!response.ok) {
    let errorMessage = `GitHub API request failed with status ${response.status}`;

    try {
      const errorPayload = (await response.json()) as { message?: string };
      if (errorPayload.message) {
        errorMessage = `GitHub API request failed: ${errorPayload.message}`;
      }
    } catch {
      // Ignore invalid error payloads and preserve the status-based message.
    }

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}

export async function fetchUserRepositories(username: string): Promise<GitHubRepository[]> {
  const repositories = await fetchGitHubApi<GitHubRepositoryApiResponse[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
  );

  return repositories.map(mapGitHubRepository);
}

export async function fetchOrganizationRepositories(org: string): Promise<GitHubRepository[]> {
  const repositories = await fetchGitHubApi<GitHubRepositoryApiResponse[]>(
    `/orgs/${encodeURIComponent(org)}/repos?per_page=100&sort=updated`,
  );

  return repositories.map(mapGitHubRepository);
}
