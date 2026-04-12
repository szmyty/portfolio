import type { Meta, StoryObj } from "@storybook/nextjs";
import { Search, FileText } from "lucide-react";
import { Icon } from "@portfolio/components/ui/Icon";
import { EmptyState } from "./EmptyState";

const meta: Meta<typeof EmptyState> = {
  title: "UI/EmptyState",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof EmptyState>;

export const Default: Story = {
  args: {
    title: "Nothing here yet",
    description: "Content will appear here once it becomes available.",
  },
};

export const WithIcon: Story = {
  args: {
    icon: <Icon icon={Search} size={48} strokeWidth={1.5} />,
    title: "No results found",
    description: "Try adjusting your search terms or clearing any active filters.",
  },
};

export const WithAction: Story = {
  args: {
    title: "No projects yet",
    description: "Projects will be listed here once they are added.",
    action: (
      <button
        type="button"
        className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
      >
        Browse all projects
      </button>
    ),
  },
};

export const WithIconAndAction: Story = {
  args: {
    icon: <Icon icon={FileText} size={48} strokeWidth={1.5} />,
    title: "No documents found",
    description: "Upload a document or check back later.",
    action: (
      <button
        type="button"
        className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-accent text-background font-medium hover:bg-accent-hover transition-colors duration-200"
      >
        Upload document
      </button>
    ),
  },
};

export const TitleOnly: Story = {
  args: {
    title: "Coming soon",
  },
};
