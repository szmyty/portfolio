import type { Meta, StoryObj } from "@storybook/nextjs";
import { configureStore } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import { GitHubScopeSelector } from "./GitHubScopeSelector";
import { githubReducer, type GitHubState } from "@portfolio/features/github/store/github.slice";

const preloadedGitHubState: GitHubState = {
  scopes: [
    {
      id: "szmyty",
      name: "szmyty",
      type: "user",
      repositories: [],
      analytics: {
        totalStars: 0,
        languageDistribution: {},
      },
    },
    {
      id: "egohygiene",
      name: "egohygiene",
      type: "organization",
      repositories: [],
      analytics: {
        totalStars: 0,
        languageDistribution: {},
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
  selectedScopeId: "egohygiene",
  status: "success",
};

const meta: Meta<typeof GitHubScopeSelector> = {
  title: "Features/GitHub/GitHubScopeSelector",
  component: GitHubScopeSelector,
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
          <div className="p-6 bg-background">
            <Story />
          </div>
        </Provider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof GitHubScopeSelector>;

export const Default: Story = {};
