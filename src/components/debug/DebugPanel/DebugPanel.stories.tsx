import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThemeProvider } from "@portfolio/lib/theme";
import { DebugPanel } from "./DebugPanel";

const meta: Meta<typeof DebugPanel> = {
  title: "Debug/DebugPanel",
  component: DebugPanel,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div className="min-h-[32rem] bg-background">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DebugPanel>;

export const Default: Story = {
  args: {
    info: {
      siteUrl: "https://example.com",
      nextVersion: "16.2.3",
      reactVersion: "19.2.5",
      locale: "en",
      nodeEnv: "development",
    },
  },
};
