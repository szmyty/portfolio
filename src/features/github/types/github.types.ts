export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  description?: string | null;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
  data_source?: "live" | "last-known-good";
  snapshot_captured_at?: string | null;
};

export type GitHubScope = {
  id: string;
  name: string;
  type: "user" | "organization";
  repositories: GitHubRepository[];
  analytics: {
    totalStars: number;
    languageDistribution: Record<string, number>;
  };
};
