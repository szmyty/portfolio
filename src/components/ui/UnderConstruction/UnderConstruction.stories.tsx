import type { Meta, StoryObj } from "@storybook/nextjs";
import { UnderConstruction } from "./UnderConstruction";

const meta: Meta<typeof UnderConstruction> = {
  title: "UI/UnderConstruction",
  component: UnderConstruction,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof UnderConstruction>;

export const Default: Story = {
  args: {
    title: "Still building",
    description: "This page is being assembled and will be available soon.",
  },
};

export const CustomCopy: Story = {
  args: {
    title: "Shipping soon",
    description: "The detailed project page is in progress.",
  },
};
