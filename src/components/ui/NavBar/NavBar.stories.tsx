import type { Meta, StoryObj } from "@storybook/nextjs";
import { NavBar } from "./NavBar";

const meta: Meta<typeof NavBar> = {
  title: "UI/NavBar",
  component: NavBar,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj<typeof NavBar>;

const items = [
  { href: "/", label: "Home" },
  { href: "/music", label: "Music" },
  { href: "/publishing", label: "Publishing" },
  { href: "/research", label: "Research" },
  { href: "/development", label: "Development" },
  { href: "/insights", label: "Insights" },
];

export const Default: Story = {
  args: {
    items,
    activeHref: "/",
    ariaLabel: "Primary navigation",
  },
};

export const ActiveRoute: Story = {
  args: {
    items,
    activeHref: "/music",
    ariaLabel: "Primary navigation",
  },
};

export const WithActions: Story = {
  args: {
    items,
    activeHref: "/",
    ariaLabel: "Primary navigation",
    rightSlot: <button>Toggle</button>,
  },
};
