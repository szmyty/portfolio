import type { GitHubRepository } from "@portfolio/features/github/types";
import fallbackSnapshot from "@portfolio/features/github/data/github-fallback.json";

const GITHUB_API_BASE_URL =
  process.env.PORTFOLIO_GITHUB_API_BASE_URL ?? "https://api.github.com";

type GitHubRepositoryApiResponse = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  _portfolio_source?: "last-known-good";
  _portfolio_captured_at?: string;
};

function mapGitHubRepository(
  repository: GitHubRepositoryApiResponse,
): GitHubRepository {
  return {
    id: repository.id,
    name: repository.name,
    full_name: repository.full_name,
    description: repository.description,
    stargazers_count: repository.stargazers_count,
    language: repository.language,
    updated_at: repository.updated_at,
    data_source: repository._portfolio_source ?? "live",
    snapshot_captured_at: repository._portfolio_captured_at ?? null,
  };
}

type GitHubFallbackSnapshot = {
  capturedAt: string;
  scopes: Record<string, GitHubRepositoryApiResponse[]>;
};

const fallback = fallbackSnapshot as GitHubFallbackSnapshot;

async function fetchGitHubApi<T>(
  endpoint: string,
  lastKnownGood: T,
): Promise<T> {
  try {
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
  } catch (error) {
    const reason = error instanceof Error ? error.message : "unknown error";
    console.warn(
      `[github] ${endpoint} unavailable (${reason}); serving last-known-good data captured ${fallback.capturedAt}.`,
    );
    return lastKnownGood;
  }
}

function getFallbackRepositories(scope: string): GitHubRepositoryApiResponse[] {
  return (fallback.scopes[scope] ?? []).map((repository) => ({
    ...repository,
    _portfolio_source: "last-known-good",
    _portfolio_captured_at: fallback.capturedAt,
  }));
}

export async function fetchUserRepositories(
  username: string,
): Promise<GitHubRepository[]> {
  const repositories = await fetchGitHubApi<GitHubRepositoryApiResponse[]>(
    `/users/${encodeURIComponent(username)}/repos?per_page=100&sort=updated`,
    getFallbackRepositories(username),
  );

  return repositories.map(mapGitHubRepository);
}

export async function fetchOrganizationRepositories(
  org: string,
): Promise<GitHubRepository[]> {
  const repositories = await fetchGitHubApi<GitHubRepositoryApiResponse[]>(
    `/orgs/${encodeURIComponent(org)}/repos?per_page=100&sort=updated`,
    getFallbackRepositories(org),
  );

  return repositories.map(mapGitHubRepository);
}
