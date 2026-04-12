import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Section } from "@portfolio/components/ui/Section";
import { LottieAnimation } from "@portfolio/components/animation/LottieAnimation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

const musicVisual = (
  <LottieAnimation
    animationData={placeholderAnimation}
    className="w-full h-full"
    style={{ maxWidth: 280, maxHeight: 280 }}
  />
);

export async function MusicSection() {
  const t = await getTranslations("MusicSection");

  return (
    <Section id="music" aria-label={t("title")} title={t("title")} background="surface" visual={musicVisual}>
      <p className="text-base sm:text-lg text-text-secondary leading-relaxed">
        {t("description")}
      </p>
      <p className="text-sm text-text-muted">
        {t("placeholder")}
      </p>
      <div className="mt-2">
        <Link
          href="/music"
          className="inline-flex items-center gap-2 text-accent hover:text-accent-hover transition-colors duration-200 font-medium"
        >
          {t("link")}
        </Link>
      </div>
    </Section>
  );
}
