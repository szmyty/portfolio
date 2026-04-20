import type { Meta, StoryObj } from "@storybook/nextjs";
import { NextIntlClientProvider } from "next-intl";
import { UnderConstruction } from "./UnderConstruction";

const messages = {
  UnderConstruction: {
    title: "Still building",
    description: "This page is being assembled and will be available soon.",
  },
};

const meta: Meta<typeof UnderConstruction> = {
  title: "UI/UnderConstruction",
  component: UnderConstruction,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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
type Story = StoryObj<typeof UnderConstruction>;

export const Default: Story = {};

export const CustomCopy: Story = {
  args: {
    title: "Shipping soon",
    description: "The detailed project page is in progress.",
  },
};
