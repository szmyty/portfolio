import type { Meta, StoryObj } from "@storybook/nextjs";
import { Center } from "./Center";

const meta: Meta<typeof Center> = {
  title: "UI/Center",
  component: Center,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Center>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-xl border border-border bg-surface px-6 py-10 text-text-primary">
        Centered content
      </div>
    ),
  },
};

export const ConstrainedWidth: Story = {
  args: {
    className: "w-full max-w-xl",
    children: (
      <div className="rounded-2xl border border-border bg-surface-overlay p-8">
        <p className="text-center text-text-secondary">
          Center keeps the child block horizontally and vertically aligned.
        </p>
      </div>
    ),
  },
};
