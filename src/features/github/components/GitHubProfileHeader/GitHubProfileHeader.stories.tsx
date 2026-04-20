import type { Meta, StoryObj } from "@storybook/nextjs";
import { GitHubProfileHeader } from "./GitHubProfileHeader";

const meta: Meta<typeof GitHubProfileHeader> = {
  title: "Features/GitHub/GitHubProfileHeader",
  component: GitHubProfileHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof GitHubProfileHeader>;

export const Default: Story = {
  render: () => (
    <div className="bg-background p-6">
      <GitHubProfileHeader />
    </div>
  ),
};
