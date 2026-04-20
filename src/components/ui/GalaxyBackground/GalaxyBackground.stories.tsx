import type { Meta, StoryObj } from "@storybook/nextjs";
import { GalaxyBackground } from "./GalaxyBackground";

const meta: Meta<typeof GalaxyBackground> = {
  title: "UI/GalaxyBackground",
  component: GalaxyBackground,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
    backgrounds: { default: "dark" },
  },
};

export default meta;
type Story = StoryObj<typeof GalaxyBackground>;

export const Default: Story = {
  render: () => (
    <div className="relative min-h-[32rem] overflow-hidden">
      <GalaxyBackground />
      <div className="relative z-10 mx-auto flex min-h-[32rem] max-w-2xl items-center justify-center px-8 text-center">
        <div className="rounded-2xl border border-white/10 bg-black/30 px-6 py-8 backdrop-blur-md">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Environment backdrop
          </h2>
          <p className="mt-3 text-white/70">
            Fixed EXR environment layer used behind immersive pages.
          </p>
        </div>
      </div>
    </div>
  ),
};
