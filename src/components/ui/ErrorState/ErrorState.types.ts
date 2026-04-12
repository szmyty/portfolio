import type { ElementType, ReactNode } from "react";

export type ErrorStateProps = {
  /** Primary heading displayed in the error state. */
  title?: string;
  /** Supporting text that provides more context about the error. */
  description?: string;
  /** Optional action element (e.g. a retry button) rendered below the description. */
  action?: ReactNode;
  /** Heading element to use for the title. Defaults to "h2". */
  headingLevel?: ElementType;
  /** Additional class names applied to the root wrapper. */
  className?: string;
};
