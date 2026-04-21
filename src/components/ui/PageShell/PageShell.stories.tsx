import type { Meta, StoryObj } from "@storybook/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { ThemeProvider } from "@portfolio/lib/theme";
import { PageShell } from "./PageShell";

const messages = {
  NavBar: {
    ariaLabel: "Main navigation",
    home: "Home",
    music: "Music",
    publishing: "Publishing",
    development: "Development",
  },
  Footer: {
    madeWith: "Made with",
    love: "love",
    by: "by",
    github: "GitHub",
    linkedin: "LinkedIn",
    email: "Email",
  },
  Author: {
    handle: "@szmyty",
  },
};

const meta: Meta<typeof PageShell> = {
  title: "UI/PageShell",
  component: PageShell,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/music",
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <ThemeProvider>
          <Story />
        </ThemeProvider>
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PageShell>;

export const Default: Story = {
  args: {
    children: (
      <div className="w-full max-w-3xl mx-auto space-y-6 px-4 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary">
          Sub-page layout
        </h1>
        <p className="text-lg text-text-secondary">
          PageShell provides the shared chrome, atmospheric background, and
          content framing for standalone pages.
        </p>
      </div>
    ),
  },
};

export const WithMultipleSections: Story = {
  args: {
    children: (
      <div className="flex flex-col items-center gap-16 w-full px-4">
        <section className="w-full max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-semibold text-text-primary">
            Section One
          </h2>
          <p className="text-text-secondary">
            This simulates a longer page with multiple sections stacked vertically.
          </p>
        </section>

        <section className="w-full max-w-3xl text-center space-y-4">
          <h2 className="text-3xl font-semibold text-text-primary">
            Section Two
          </h2>
          <p className="text-text-secondary">
            PageShell ensures consistent spacing, layout, and background layering.
          </p>
        </section>
      </div>
    ),
  },
};