import type { ReactNode } from "react";

export type EmptyStateProps = {
  /** Primary heading displayed in the empty state. */
  title: string;
  /** Supporting text that provides more context. */
  description?: string;
  /** Optional icon or illustration rendered above the title. */
  icon?: ReactNode;
  /** Optional action element (e.g. a button or link) rendered below the description. */
  action?: ReactNode;
  /** Additional class names applied to the root wrapper. */
  className?: string;
}
