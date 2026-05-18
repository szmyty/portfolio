import type { ReactNode } from "react";
import type { SectionBackground } from "@portfolio/components/ui/Section";

type ContentSectionNamespace =
  | "MusicSection"
  | "PublishingSection"
  | "DevelopmentSection";

export type ContentSectionTemplateProps = {
  id: string;
  namespace: ContentSectionNamespace;
  background?: SectionBackground;
  href: string;
  /** Optional visual to render in the right column. Defaults to the placeholder Lottie animation. */
  visual?: ReactNode;
};
