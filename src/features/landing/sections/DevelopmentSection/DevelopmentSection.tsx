import { ContentSectionTemplate } from "@portfolio/features/landing/sections/ContentSectionTemplate";
import { FloppyDiskVisual } from "./FloppyDiskVisual";

export function DevelopmentSection() {
  return (
    <ContentSectionTemplate
      id="development"
      namespace="DevelopmentSection"
      background="surface"
      href="/development"
      visual={<FloppyDiskVisual />}
    />
  );
}
