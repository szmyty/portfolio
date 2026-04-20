import type { Meta, StoryObj } from "@storybook/nextjs";
import { GitHubDashboardContainer } from "./GitHubDashboardContainer";

const meta: Meta<typeof GitHubDashboardContainer> = {
  title: "Features/GitHub/GitHubDashboardContainer",
  component: GitHubDashboardContainer,
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof GitHubDashboardContainer>;

export const Default: Story = {
  args: {
    initialScopes: [
      {
        id: "szmyty",
        name: "szmyty",
        type: "user",
        repositories: [
          {
            id: 1,
            name: "portfolio",
            full_name: "szmyty/portfolio",
            stargazers_count: 5,
            language: "TypeScript",
            updated_at: "2026-04-20T00:00:00Z",
          },
        ],
        analytics: {
          totalStars: 5,
          languageDistribution: {
            TypeScript: 1,
          },
        },
      },
    ],
  },
};
