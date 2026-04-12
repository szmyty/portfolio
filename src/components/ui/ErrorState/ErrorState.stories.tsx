import type { Meta, StoryObj } from "@storybook/nextjs";
import { ErrorState } from "./ErrorState";

const meta: Meta<typeof ErrorState> = {
  title: "UI/ErrorState",
  component: ErrorState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ErrorState>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    title: "Failed to load content",
    description: "An unexpected error occurred. Please try again.",
  },
};

export const WithAction: Story = {
  args: {
    title: "Failed to load projects",
    description: "Check your connection and try again.",
    action: (
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-background font-medium hover:bg-accent-hover transition-colors duration-200"
      >
        Retry
      </button>
    ),
  },
};
