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
    size: "md",
    children: (
      <p className="text-text-primary p-4">
        Default container (md width).
      </p>
    ),
  },
};

export const Large: Story = {
  args: {
    size: "lg",
    children: (
      <p className="text-text-primary p-4">
        Large container.
      </p>
    ),
  },
};

export const FullWidth: Story = {
  args: {
    size: "full",
    children: (
      <p className="text-text-primary p-4">
        Full width container.
      </p>
    ),
  },
};

export const WithCustomClass: Story = {
  args: {
    size: "md",
    className: "bg-surface p-4 rounded",
    children: (
      <p className="text-text-secondary">
        Container with custom styling.
      </p>
    ),
  },
};
