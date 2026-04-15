import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ReactElement } from "react";
import { Scene } from "@portfolio/features/three/scenes";

const meta: Meta<typeof Scene> = {
  title: "Three/Scene",
  component: Scene,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  decorators: [
    (Story: () => ReactElement) => (
      <div style={{ width: "100%", height: "100vh" }}>
        <Story />
      </div>
    ),
  ],
};

export const Contained: Story = {
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story: () => ReactElement) => (
      <div style={{ width: "600px", height: "400px" }}>
        <Story />
      </div>
    ),
  ],
};
