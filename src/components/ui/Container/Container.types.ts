import type { ReactNode } from "react";

export type ContainerSize =
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

export type ContainerProps = {
  children: ReactNode;
  className?: string;
  size?: ContainerSize;
};
