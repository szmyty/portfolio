import type { Meta, StoryObj } from "@storybook/nextjs";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { GitHubLanguageChart } from "./GitHubLanguageChart";
import { githubReducer, type GitHubState } from "@portfolio/features/github/store/github.slice";

const preloadedGitHubState: GitHubState = {
  scopes: [
    {
      id: "szmyty",
      name: "szmyty",
      type: "user",
      repositories: [
        {
          id: 1,
          name: "portfolio",
          full_name: "szmyty/portfolio",
          description: "Portfolio site",
          stargazers_count: 12,
          language: "TypeScript",
          updated_at: "2026-04-20T00:00:00Z",
        },
        {
          id: 2,
          name: "scripts",
          full_name: "szmyty/scripts",
          description: "Automation scripts",
          stargazers_count: 3,
          language: "Python",
          updated_at: "2026-04-18T00:00:00Z",
        },
        {
          id: 3,
          name: "notes",
          full_name: "szmyty/notes",
          description: "Notes and snippets",
          stargazers_count: 1,
          language: "Python",
          updated_at: "2026-04-17T00:00:00Z",
        },
        {
          id: 4,
          name: "dotfiles",
          full_name: "szmyty/dotfiles",
          description: "Shell config",
          stargazers_count: 2,
          language: "Shell",
          updated_at: "2026-04-15T00:00:00Z",
        },
      ],
      analytics: {
        totalStars: 18,
        languageDistribution: {
          TypeScript: 1,
          Python: 2,
          Shell: 1,
        },
      },
    },
    {
      id: "egohygiene",
      name: "egohygiene",
      type: "organization",
      repositories: [
        {
          id: 5,
          name: "sanctuary",
          full_name: "egohygiene/sanctuary",
          description: "Community platform experiments.",
          stargazers_count: 8,
          language: "TypeScript",
          updated_at: "2026-04-12T00:00:00Z",
        },
      ],
      analytics: {
        totalStars: 8,
        languageDistribution: {
          TypeScript: 1,
        },
      },
    },
  ],
  selectedScopeId: null,
  status: "success",
};

const meta: Meta<typeof GitHubLanguageChart> = {
  title: "Features/GitHub/GitHubLanguageChart",
  component: GitHubLanguageChart,
  tags: ["autodocs"],
  decorators: [
    (Story) => {
      const store = configureStore({
        reducer: {
          github: githubReducer,
        },
        preloadedState: {
          github: preloadedGitHubState,
        },
      });

      return (
        <Provider store={store}>
          <div className="min-h-[28rem] bg-background p-6">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GitHubLanguageChart>;

export const Default: Story = {};
