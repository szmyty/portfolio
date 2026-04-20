import type { Meta, StoryObj } from "@storybook/nextjs";
import placeholderAnimation from "@portfolio/animations/placeholder.json";
import { LottieAnimation } from "./LottieAnimation";

const meta: Meta<typeof LottieAnimation> = {
  title: "Animation/LottieAnimation",
  component: LottieAnimation,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LottieAnimation>;

export const Default: Story = {
  args: {
    animationData: placeholderAnimation,
    className: "h-40 w-40",
  },
};

export const NonLooping: Story = {
  args: {
    animationData: placeholderAnimation,
    loop: false,
    className: "h-48 w-48",
  },
};
