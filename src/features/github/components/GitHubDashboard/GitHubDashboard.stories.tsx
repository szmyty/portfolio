import type { Meta, StoryObj } from "@storybook/nextjs";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { GitHubDashboard } from "./GitHubDashboard";
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
          description: "Personal portfolio site with a GitHub intelligence dashboard.",
          stargazers_count: 12,
          language: "TypeScript",
          updated_at: "2026-04-20T00:00:00Z",
        },
      ],
      analytics: {
        totalStars: 12,
        languageDistribution: {
          TypeScript: 1,
        },
      },
    },
    {
      id: "egohygiene",
      name: "egohygiene",
      type: "organization",
      repositories: [
        {
          id: 2,
          name: "sanctuary",
          full_name: "egohygiene/sanctuary",
          description: "Community platform experiments.",
          stargazers_count: 8,
          language: "TypeScript",
          updated_at: "2026-04-18T00:00:00Z",
        },
      ],
      analytics: {
        totalStars: 8,
        languageDistribution: {
          TypeScript: 1,
        },
      },
    },
    {
      id: "incomprisllc",
      name: "incomprisllc",
      type: "organization",
      repositories: [],
      analytics: {
        totalStars: 0,
        languageDistribution: {},
      },
    },
  ],
  selectedScopeId: null,
  status: "success",
};

const meta: Meta<typeof GitHubDashboard> = {
  title: "Features/GitHub/GitHubDashboard",
  component: GitHubDashboard,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
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
          <div className="bg-background">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GitHubDashboard>;

export const Default: Story = {};
