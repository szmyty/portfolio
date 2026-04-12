import type { LucideIcon } from "lucide-react";

export interface IconProps {
  /** The Lucide icon component to render. */
  icon: LucideIcon;
  /** Width and height of the icon in pixels. Defaults to 24. */
  size?: number;
  /** Additional class names applied to the SVG element. */
  className?: string;
  /** Accessible label for the icon. If omitted the icon is hidden from assistive technology. */
  label?: string;
  /** Stroke width passed to the underlying SVG. Defaults to the lucide-react default (2). */
  strokeWidth?: number;
}
