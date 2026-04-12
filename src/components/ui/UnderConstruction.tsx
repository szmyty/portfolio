"use client";

import { useTranslations } from "next-intl";
import { LottieAnimation } from "@portfolio/components/animation";
import placeholderAnimation from "@portfolio/animations/placeholder.json";

interface UnderConstructionProps {
  title?: string;
  description?: string;
}

export function UnderConstruction({ title, description }: UnderConstructionProps) {
  const t = useTranslations("UnderConstruction");

  return (
    <div className="flex flex-col items-center gap-6 text-center w-full max-w-sm sm:max-w-md px-4">
      <LottieAnimation
        animationData={placeholderAnimation}
        className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48"
      />
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-text-primary">
        {title ?? t("title")}
      </h2>
      <p className="text-base sm:text-lg text-text-secondary">
        {description ?? t("description")}
      </p>
    </div>
  );
}
