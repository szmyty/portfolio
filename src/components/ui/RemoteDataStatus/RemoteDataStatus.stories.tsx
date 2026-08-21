import type { Meta, StoryObj } from "@storybook/nextjs";
import { RemoteDataStatus } from "./RemoteDataStatus";

const messages = {
  loading: "Loading portfolio data",
  emptyTitle: "Nothing published yet",
  emptyDescription: "The source responded successfully with no items.",
  staleTitle: "Data may be out of date",
  staleDescription: "The latest response is older than the freshness target.",
  lastKnownGoodDescription:
    "The live source is unavailable, so the last known good response is shown.",
  errorTitle: "Data is temporarily unavailable",
  errorDescription: "The source failed and no safe fallback is available.",
};

const meta: Meta<typeof RemoteDataStatus> = {
  title: "UI/RemoteDataStatus",
  component: RemoteDataStatus,
  tags: ["autodocs"],
  args: { messages },
};

export default meta;
type Story = StoryObj<typeof RemoteDataStatus>;

export const Loading: Story = {
  args: {
    contract: { status: "loading", freshness: null, source: "none" },
  },
};

export const Empty: Story = {
  args: {
    contract: { status: "empty", freshness: "fresh", source: "live" },
  },
};

export const Stale: Story = {
  args: {
    contract: { status: "available", freshness: "stale", source: "live" },
  },
};

export const LastKnownGood: Story = {
  args: {
    contract: {
      status: "available",
      freshness: "stale",
      source: "last-known-good",
    },
  },
};

export const Error: Story = {
  args: {
    contract: { status: "error", freshness: null, source: "none" },
  },
};
