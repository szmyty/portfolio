import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Section } from "@portfolio/components/ui/Section";
import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";
import type { ContentSectionTemplateProps } from "./ContentSectionTemplate.types";

const defaultVisual = (
  <LottieAnimation
    animationData={placeholderAnimation}
    className="w-full h-full"
    style={{ maxWidth: 280, maxHeight: 280 }}
  />
);

/**
 * ContentSectionTemplate — shared async server component for Music, Publishing,
 * and Development landing-page sections.
 *
 * Centralises the repeated layout logic (visual, description paragraph,
 * placeholder note, and "Explore …" link) so each domain section only needs to
 * supply its unique configuration: id, translation namespace, background colour,
 * destination href, and an optional visual override.
 *
 * Usage:
 * ```tsx
 * <ContentSectionTemplate
 *   id="music"
 *   namespace="MusicSection"
 *   background="surface"
 *   href="/music"
 * />
 * ```
 *
 * With a custom visual:
 * ```tsx
 * <ContentSectionTemplate
 *   id="publishing"
 *   namespace="PublishingSection"
 *   href="/publishing"
 *   visual={<MagazineScene />}
 * />
 * ```
 */
export async function ContentSectionTemplate({
  id,
  namespace,
  background = "background",
  href,
  visual = defaultVisual,
}: ContentSectionTemplateProps) {
  const t = await getTranslations(namespace);

  return (
    <Section
      id={id}
      aria-label={t("title")}
      title={t("title")}
      background={background}
      visual={visual}
    >
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
        {t("description")}
      </p>
      <p className="text-sm text-text-muted">
        {t("placeholder")}
      </p>
      <div className="mt-2">
        <Link
          href={href}
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
        >
          {t("link")}
        </Link>
      </div>
    </Section>
  );
}
