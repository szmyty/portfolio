import type { Meta, StoryObj } from "@storybook/nextjs";
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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
    ),
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
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    ),
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
