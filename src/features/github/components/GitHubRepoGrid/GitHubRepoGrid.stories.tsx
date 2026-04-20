import type { Meta, StoryObj } from "@storybook/nextjs";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { GitHubRepoGrid } from "./GitHubRepoGrid";
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
          description: "Personal portfolio site with server-rendered GitHub data.",
          stargazers_count: 12,
          language: "TypeScript",
          updated_at: "2026-04-20T00:00:00Z",
        },
        {
          id: 2,
          name: "notes",
          full_name: "szmyty/notes",
          description: null,
          stargazers_count: 3,
          language: "Python",
          updated_at: "2026-04-18T00:00:00Z",
        },
      ],
      analytics: {
        totalStars: 15,
        languageDistribution: {
          TypeScript: 1,
          Python: 1,
        },
      },
    },
    {
      id: "egohygiene",
      name: "egohygiene",
      type: "organization",
      repositories: [
        {
          id: 3,
          name: "sanctuary",
          full_name: "egohygiene/sanctuary",
          description: "Community platform experiments.",
          stargazers_count: 8,
          language: "TypeScript",
          updated_at: "2026-04-15T00:00:00Z",
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

const meta: Meta<typeof GitHubRepoGrid> = {
  title: "Features/GitHub/GitHubRepoGrid",
  component: GitHubRepoGrid,
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
          <div className="min-h-[24rem] bg-background p-6">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GitHubRepoGrid>;

export const Default: Story = {};
