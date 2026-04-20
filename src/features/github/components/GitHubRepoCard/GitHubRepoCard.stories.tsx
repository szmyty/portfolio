import type { Meta, StoryObj } from "@storybook/nextjs";
import { GitHubRepoCard } from "./GitHubRepoCard";

const meta: Meta<typeof GitHubRepoCard> = {
  title: "Features/GitHub/GitHubRepoCard",
  component: GitHubRepoCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof GitHubRepoCard>;

export const Default: Story = {
  args: {
    repository: {
      id: 1,
      name: "portfolio",
      full_name: "szmyty/portfolio",
      description: "Personal portfolio site with a GitHub intelligence dashboard.",
      stargazers_count: 12,
      language: "TypeScript",
      updated_at: "2026-04-20T00:00:00Z",
    },
  },
};
