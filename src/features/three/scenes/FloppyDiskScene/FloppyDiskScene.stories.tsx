import type { Meta, StoryObj } from "@storybook/nextjs";
import type { ReactElement } from "react";
import { ThemeProvider } from "@portfolio/lib/theme";
import { FloppyDiskScene } from "./FloppyDiskScene";

const meta: Meta<typeof FloppyDiskScene> = {
  title: "Three/FloppyDiskScene",
  component: FloppyDiskScene,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Full Canvas scene wrapper for the interactive 3D floppy disk. Provides a camera, theme-aware lighting, and the FloppyDisk object. Mirrors the VinylRecordScene and MagazineScene pattern for the Development section visual slot.",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FloppyDiskScene>;

/**
 * Default scene — interactive floppy disk with theme-aware lighting inside
 * a fixed-size container that mirrors the section visual slot proportions.
 */
export const Default: Story = {
  decorators: [
    (Story: () => ReactElement) => (
      <div style={{ width: "400px", height: "400px" }}>
        <Story />
      </div>
    ),
  ],
};

/**
 * Larger viewport — useful for inspecting material details and label texture.
 */
export const Large: Story = {
  decorators: [
    (Story: () => ReactElement) => (
      <div style={{ width: "600px", height: "600px" }}>
        <Story />
      </div>
    ),
  ],
};
