import { ContentSectionTemplate } from "@portfolio/features/landing/sections/ContentSectionTemplate";
import { VinylVisual } from "./VinylVisual";

export function MusicSection() {
  return (
    <ContentSectionTemplate
      id="music"
      namespace="MusicSection"
      background="surface"
      href="/music"
      visual={<VinylVisual />}
    />
  );
}
