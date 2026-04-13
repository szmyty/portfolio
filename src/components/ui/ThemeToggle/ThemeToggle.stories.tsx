import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { ThemeProvider } from "@portfolio/lib/theme";
import { ThemeToggle } from "./ThemeToggle";

const meta: Meta<typeof ThemeToggle> = {
  title: "UI/ThemeToggle",
  component: ThemeToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
type Story = StoryObj<typeof ThemeToggle>;

/** Default state — inherits the stored (or default dark) theme preference. */
export const Default: Story = {};

/** Rendered against the light canvas background so light-mode styles are visible. */
export const LightMode: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

/** Rendered against the dark canvas background (default). */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};
