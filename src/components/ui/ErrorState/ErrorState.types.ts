import type { ElementType, ReactNode } from "react";

export type ErrorStateProps = {
  /** Primary heading displayed in the error state. */
  title?: ReactNode;

  /** Supporting text that provides more context about the error. */
  description?: ReactNode;

  /** Optional action element (e.g. a retry button). */
  action?: ReactNode;

  /** Heading element to use for the title. Defaults to "h2". */
  headingLevel?: ElementType<{ children?: ReactNode; className?: string }>;

  /** Additional class names applied to the root wrapper. */
  className?: string;
};
