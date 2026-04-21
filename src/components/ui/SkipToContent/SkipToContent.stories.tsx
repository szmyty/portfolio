import type { Meta, StoryObj } from "@storybook/nextjs";
import { SkipToContent } from "./SkipToContent";

const meta: Meta<typeof SkipToContent> = {
  title: "UI/SkipToContent",
  component: SkipToContent,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof SkipToContent>;

export const Default: Story = {
  args: {
    label: "Skip to main content",
    targetId: "storybook-main-content",
  },
  render: (args) => (
    <div className="min-h-[18rem] bg-background p-6">
      <SkipToContent {...args} />

      <header className="rounded-xl border border-border bg-surface p-4 text-text-secondary">
        Tab into the canvas to reveal the skip link.
      </header>

      <main
        id="storybook-main-content"
        tabIndex={-1}
        className="mt-12 rounded-xl border border-border bg-surface-overlay p-6 text-text-primary"
      >
        Main content target
      </main>
    </div>
  ),
};
