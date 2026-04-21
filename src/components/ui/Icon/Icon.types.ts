import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

export type IconProps = {
  /** The Lucide icon component to render. */
  icon: LucideIcon;

  /** Width and height of the icon in pixels. Defaults to 24. */
  size?: number;

  /** Additional class names applied to the SVG element. */
  className?: string;

  /** Accessible label (i18n-ready). If omitted, icon is hidden from assistive tech. */
  label?: ReactNode;

  /** Accessible label for screen readers */
  ariaLabel?: string;

  /** Stroke width passed to the underlying SVG. */
  strokeWidth?: number;
};
