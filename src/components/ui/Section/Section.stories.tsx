import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { Section } from "./Section";

const meta: Meta<typeof Section> = {
  title: "UI/Section",
  component: Section,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    background: {
      control: { type: "select" },
      options: ["background", "surface"],
      description: "Background colour token applied to the section.",
    },
    cosmicBackground: {
      control: "boolean",
      description: "Whether to render the CosmicBackground overlay.",
    },
    title: {
      control: "text",
      description: "Optional heading rendered above the children.",
    },
    className: {
      control: "text",
    },
  },
};

export default meta;
type Story = StoryObj<typeof Section>;

/** Minimal section — title and a short paragraph. */
export const Default: Story = {
  args: {
    id: "demo",
    "aria-label": "Demo section",
    title: "Section Heading",
    children: (
      <p className="text-text-secondary text-base leading-relaxed">
        This is the main content area of the section. It can contain any
        combination of text, links, or other elements.
      </p>
    ),
    background: "background",
    cosmicBackground: true,
  },
};

/** Surface background variant — slightly elevated background token. */
export const SurfaceBackground: Story = {
  args: {
    ...Default.args,
    title: "Surface Background",
    background: "surface",
  },
};

/** Section without the cosmic background overlay. */
export const NoCosmicBackground: Story = {
  args: {
    ...Default.args,
    title: "Without Cosmic Background",
    cosmicBackground: false,
  },
};

/** Two-column layout — text on the left, a visual placeholder on the right. */
export const WithVisual: Story = {
  args: {
    id: "visual-demo",
    "aria-label": "Section with visual",
    title: "With Visual Slot",
    children: (
      <p className="text-text-secondary text-base leading-relaxed">
        When a <code className="text-accent">visual</code> prop is provided the
        layout switches to a two-column arrangement on medium screens and wider.
      </p>
    ),
    visual: (
      <div className="w-full h-48 rounded-xl bg-surface border border-border flex items-center justify-center text-text-muted text-sm">
        Visual placeholder
      </div>
    ),
    background: "background",
    cosmicBackground: true,
  },
};

/** Section without a title — children fill the full text column. */
export const NoTitle: Story = {
  args: {
    id: "no-title",
    "aria-label": "Section without title",
    children: (
      <p className="text-text-secondary text-base leading-relaxed">
        A section without a title. The children occupy the full text column
        without a preceding heading.
      </p>
    ),
    background: "background",
    cosmicBackground: false,
  },
};

/** Light-mode appearance. */
export const LightMode: Story = {
  args: Default.args,
  parameters: {
    backgrounds: { default: "light" },
  },
};
