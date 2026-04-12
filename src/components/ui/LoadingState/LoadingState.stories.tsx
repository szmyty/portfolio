import type { Meta, StoryObj } from "@storybook/nextjs";
import { LoadingState } from "./LoadingState";

const meta: Meta<typeof LoadingState> = {
  title: "UI/LoadingState",
  component: LoadingState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LoadingState>;

export const Default: Story = {};

export const WithDescription: Story = {
  args: {
    description: "Fetching your latest content, please wait.",
  },
};

export const CustomLabel: Story = {
  args: {
    label: "Loading projects…",
    description: "Retrieving your software projects.",
  },
};
