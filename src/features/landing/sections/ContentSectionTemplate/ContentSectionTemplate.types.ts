import type { SectionBackground } from "@portfolio/components/ui/Section/Section.types";

export type ContentSectionTemplateProps = {
  id: string;
  namespace: string;
  background?: SectionBackground;
  href: string;
};
