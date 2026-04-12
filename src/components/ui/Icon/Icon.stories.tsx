import type { Meta, StoryObj } from "@storybook/nextjs";
import { Search, FileText, FolderOpen, AlertCircle, Music, Code, BookOpen } from "lucide-react";
import { Icon } from "./Icon";

const meta: Meta<typeof Icon> = {
  title: "UI/Icon",
  component: Icon,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    icon: {
      description: "The Lucide icon component to render.",
      control: false,
    },
    size: {
      control: { type: "range", min: 16, max: 96, step: 4 },
    },
    strokeWidth: {
      control: { type: "range", min: 0.5, max: 3, step: 0.5 },
    },
  },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
  args: {
    icon: Search,
    size: 24,
  },
};

export const Large: Story = {
  args: {
    icon: FolderOpen,
    size: 48,
  },
};

export const WithLabel: Story = {
  args: {
    icon: AlertCircle,
    size: 32,
    label: "Alert",
  },
};

export const CustomStrokeWidth: Story = {
  args: {
    icon: FileText,
    size: 48,
    strokeWidth: 1.5,
  },
};

export const Gallery: Story = {
  render: () => (
    <div className="flex flex-wrap gap-6 items-center justify-center p-4">
      {[Search, FileText, FolderOpen, AlertCircle, Music, Code, BookOpen].map((LucideIcon, i) => (
        <div key={i} className="flex flex-col items-center gap-2 text-text-muted">
          <Icon icon={LucideIcon} size={32} strokeWidth={1.5} />
        </div>
      ))}
    </div>
  ),
};
