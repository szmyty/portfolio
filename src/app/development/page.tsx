import { PageShell } from "@portfolio/components/ui/PageShell";
import { getTranslations } from "next-intl/server";
import { StandaloneFloppyDiskVisual } from "@portfolio/features/landing/sections/DevelopmentSection/FloppyDiskVisual";

export default async function DevelopmentPage() {
  const t = await getTranslations("DevelopmentSection");

  return (
    <PageShell>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-4 py-8 md:flex-row md:items-center md:gap-16">
        <div className="flex-1 space-y-6">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {t("title")}
          </h1>
          <p className="text-lg leading-relaxed text-text-secondary sm:text-xl">
            {t("description")}
          </p>
          <p className="text-sm text-text-muted">
            {t("placeholder")}
          </p>
        </div>
        <div className="flex w-full justify-center md:w-auto md:flex-shrink-0">
          <StandaloneFloppyDiskVisual />
        </div>
      </div>
    </PageShell>
  );
}
