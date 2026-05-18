"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import type { GitHubProfileHeaderProps } from "./GitHubProfileHeader.types";

export function GitHubProfileHeader(_props: GitHubProfileHeaderProps) {
  const t = useTranslations("GitHub");

  return (
    <div className="rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-7 sm:py-7">
      <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-center sm:gap-6 sm:text-left">
        <div className="relative shrink-0">
          <div className="absolute inset-0 rounded-full bg-accent/20 blur-xl" aria-hidden="true" />
          <a
            href="https://github.com/szmyty/szmyty"
            target="_blank"
            rel="noopener noreferrer"
            className="relative block overflow-hidden rounded-full border border-border bg-background p-1 shadow-[0_0_0_1px_color-mix(in_srgb,var(--border)_45%,transparent)] transition-transform duration-200 hover:scale-105"
          >
            <Image
              src="/textures/github/github-profile.png"
              alt={t("profile.imageAlt")}
              width={112}
              height={112}
              className="h-28 w-28 rounded-full object-cover"
              priority
            />
          </a>
        </div>

        <div className="min-w-0 space-y-2.5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-text-muted">
            {t("profile.eyebrow")}
          </p>
          <h2 className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
            {t("profile.title")}
          </h2>
          <p className="text-base leading-relaxed text-text-secondary sm:text-lg">
            {t("profile.subtitle")}
          </p>
        </div>
      </div>
    </div>
  );
}
