import type { Meta, StoryObj } from "@storybook/nextjs";
import { Container } from "./Container";

const meta: Meta<typeof Container> = {
  title: "UI/Container",
  component: Container,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
  args: {
    children: (
      <p className="text-text-primary p-4">
        This is a container with max width of 2xl.
      </p>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    className: "max-w-lg bg-surface p-4 rounded",
    children: (
      <p className="text-text-secondary">
        Container with a custom class applied.
      </p>
    ),
  },
};
