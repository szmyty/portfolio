export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  stargazers_count: number;
  language: string | null;
  updated_at: string;
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
