import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LandingBackground } from "@portfolio/features/landing/LandingBackground";

export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-background">
      {/* Reuse the same 3D visual identity used on the landing page */}
      <LandingBackground />

      {/* Overlay content centered on the screen */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 sm:px-8">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center w-full max-w-sm sm:max-w-md">
          <p className="text-6xl sm:text-7xl font-bold tracking-tight text-accent">
            {t("code")}
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
            {t("heading")}
          </h1>
          <p className="text-base sm:text-lg text-text-secondary">
            {t("description")}
          </p>
          <Link
            href="/"
            className="mt-2 rounded-md border border-border px-5 py-2.5 text-sm text-text-primary transition-colors duration-200 hover:bg-border hover:text-accent"
          >
            {t("homeLink")}
          </Link>
        </div>
      </div>
    </div>
  );
}
