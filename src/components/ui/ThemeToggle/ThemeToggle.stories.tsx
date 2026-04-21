import type { Meta, StoryObj } from "@storybook/nextjs";
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

export const Default: Story = {};

export const CustomLabels: Story = {
  args: {
    labels: {
      light: "Light Mode",
      dark: "Dark Mode",
      system: "System Mode",
    },
  },
};

export const LightMode: Story = {
  parameters: {
    backgrounds: { default: "light" },
  },
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: "dark" },
  },
};
