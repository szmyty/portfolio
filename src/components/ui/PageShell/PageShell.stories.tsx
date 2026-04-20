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
      <div className="w-full max-w-3xl space-y-6 px-4 text-center">
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
