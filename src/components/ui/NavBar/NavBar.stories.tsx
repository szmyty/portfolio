import type { Meta, StoryObj } from "@storybook/nextjs";
import React from "react";
import { NextIntlClientProvider } from "next-intl";
import { NavBar } from "./NavBar";

const messages = {
  NavBar: {
    ariaLabel: "Main navigation",
    home: "Home",
    music: "Music",
    publishing: "Publishing",
    development: "Development",
  },
};

const meta: Meta<typeof NavBar> = {
  title: "UI/NavBar",
  component: NavBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={messages}>
        <Story />
      </NextIntlClientProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof NavBar>;

/** NavBar on the home page — section links use hash hrefs and the observer is active. */
export const HomePage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/** NavBar on a sub-page — section links point to `/#section` instead of `#section`. */
export const SubPage: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/music",
      },
    },
  },
};

/** Light-mode appearance. */
export const LightMode: Story = {
  parameters: {
    backgrounds: { default: "light" },
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};

/** Dark-mode appearance (default). */
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
};
