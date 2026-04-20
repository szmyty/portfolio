import type { Meta, StoryObj } from "@storybook/nextjs";
import { ThemeProvider } from "@portfolio/lib/theme";
import { CosmicBackground } from "./CosmicBackground";

const meta: Meta<typeof CosmicBackground> = {
  title: "UI/CosmicBackground",
  component: CosmicBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
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
type Story = StoryObj<typeof CosmicBackground>;

export const Hero: Story = {
  args: {
    mode: "hero",
  },
  render: (args) => (
    <div className="relative min-h-[32rem] overflow-hidden bg-background">
      <CosmicBackground {...args} />
      <div className="relative z-10 mx-auto flex min-h-[32rem] max-w-3xl items-center justify-center px-8 text-center">
        <div className="space-y-3">
          <h2 className="text-4xl font-bold tracking-tight text-text-primary">
            Hero atmosphere
          </h2>
          <p className="text-text-secondary">
            Full-intensity parallax starfield for top-level landing moments.
          </p>
        </div>
      </div>
    </div>
  ),
};

export const Content: Story = {
  args: {
    mode: "content",
  },
  render: (args) => (
    <div className="relative min-h-[28rem] overflow-hidden bg-background">
      <CosmicBackground {...args} />
      <div className="relative z-10 mx-auto max-w-2xl px-8 py-24">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">
          Content mode
        </h2>
        <p className="mt-4 text-text-secondary">
          Reduced visual intensity keeps section copy readable while preserving
          the same cosmic language.
        </p>
      </div>
    </div>
  ),
};
