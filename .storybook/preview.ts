import type { Decorator, Preview } from "@storybook/nextjs";
import React, { useEffect } from "react";
import "../src/app/globals.css";

/**
 * Hex value of the "light" entry in the Storybook backgrounds panel.
 * Must match the `value` field in `parameters.backgrounds.values` below.
 */
const LIGHT_BACKGROUND = "#f5f5f5";

/**
 * Inner React component that applies the resolved theme to `<html>`.
 * Hooks must live inside a proper React function component to satisfy
 * the `react-hooks/rules-of-hooks` lint rule.
 */
const ThemeApplicator: React.FC<{
  isLight: boolean;
  Story: React.ComponentType;
}> = ({ isLight, Story }) => {
  useEffect(() => {
    if (isLight) {
      document.documentElement.setAttribute("data-theme", "light");
    } else {
      document.documentElement.removeAttribute("data-theme");
    }
  }, [isLight]);

  return React.createElement(Story);
};

/**
 * Synchronises the Storybook backgrounds panel selection with the
 * `data-theme` attribute on `<html>` so that the Tailwind theme-aware
 * CSS custom properties defined in `globals.css` match the visible canvas
 * colour — mirroring what `ThemeProvider` does inside the Next.js app.
 */
const withTheme: Decorator = (Story, context) => {
  const bgValue = (
    context.globals as Record<string, { value?: string } | undefined>
  ).backgrounds?.value;
  const isLight = bgValue === LIGHT_BACKGROUND;

  return React.createElement(ThemeApplicator, { isLight, Story });
};

const preview: Preview = {
  decorators: [withTheme],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "dark",
      values: [
        { name: "dark", value: "#0a0a0a" },
        { name: "light", value: "#f5f5f5" },
      ],
    },
  },
};

export default preview;
