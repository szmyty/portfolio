import type { ReactNode } from "react";
import type { SectionBackground } from "@portfolio/components/ui/Section/Section.types";

export type ContentSectionTemplateProps = {
  id: string;
  namespace: string;
  background?: SectionBackground;
  href: string;
  /** Optional visual to render in the right column. Defaults to the placeholder Lottie animation. */
  visual?: ReactNode;
};
