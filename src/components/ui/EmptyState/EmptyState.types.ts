import type { ReactNode } from "react";

export type EmptyStateProps = {
  /** Primary heading displayed in the empty state. */
  title?: ReactNode;

  /** Supporting text that provides more context. */
  description?: ReactNode;

  /** Optional icon or illustration rendered above the title. */
  icon?: ReactNode;

  /** Optional action element (e.g. button or link). */
  action?: ReactNode;

  /** Additional class names applied to the root wrapper. */
  className?: string;
};
