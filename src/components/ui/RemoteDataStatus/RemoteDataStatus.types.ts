import type { ReactNode } from "react";

export type RemoteDataContract =
  | { status: "loading"; freshness: null; source: "none" }
  | { status: "empty"; freshness: "fresh"; source: "live" }
  | { status: "available"; freshness: "fresh"; source: "live" }
  | {
      status: "available";
      freshness: "stale";
      source: "live" | "last-known-good";
    }
  | { status: "error"; freshness: null; source: "none" };

export type RemoteDataMessages = {
  loading: string;
  emptyTitle: string;
  emptyDescription: string;
  staleTitle: string;
  staleDescription: string;
  lastKnownGoodDescription: string;
  errorTitle: string;
  errorDescription: string;
};

export type RemoteDataStatusProps = {
  contract: RemoteDataContract;
  messages: RemoteDataMessages;
  action?: ReactNode;
  className?: string;
};
