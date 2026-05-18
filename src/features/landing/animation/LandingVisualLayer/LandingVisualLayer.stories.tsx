import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ReactElement } from "react";
import { LandingVisualLayer } from "./LandingVisualLayer";

const meta: Meta<typeof LandingVisualLayer> = {
  title: "Landing/LandingVisualLayer",
  component: LandingVisualLayer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "The interactive WebGL layer (layer 1) of the landing page pointer-event stack. Renders the 3D hero scene inside an absolute-positioned div so drag and hover events reach the canvas.",
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof LandingVisualLayer>;

/**
 * Default rendering of the visual layer inside a viewport-sized container,
 * matching its production placement on the landing page.
 */
export const Default: Story = {
  decorators: [
    (Story: () => ReactElement) => (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100vh",
          background: "#0a0a0f",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
};

/**
 * Contained variant showing the visual layer in a fixed-size box.
 * Useful for inspecting the scene in a smaller viewport.
 */
export const Contained: Story = {
  parameters: {
    layout: "centered",
  },
  decorators: [
    (Story: () => ReactElement) => (
      <div
        style={{
          position: "relative",
          width: "600px",
          height: "400px",
          background: "#0a0a0f",
          overflow: "hidden",
        }}
      >
        <Story />
      </div>
    ),
  ],
};
