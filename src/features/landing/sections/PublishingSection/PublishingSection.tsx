import { ContentSectionTemplate } from "@portfolio/features/landing/sections/ContentSectionTemplate";
import { MagazineVisual } from "./MagazineVisual";

export function PublishingSection() {
  return (
    <ContentSectionTemplate
      id="publishing"
      namespace="PublishingSection"
      background="background"
      href="/publishing"
      visual={<MagazineVisual />}
    />
  );
}
