"use client";

import { useTranslations } from "next-intl";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedScope, type GitHubState } from "@portfolio/features/github/store/github.slice";
import { selectSortedScopes } from "@portfolio/features/github/store/github.selectors";
import type { GitHubScopeSelectorProps } from "./GitHubScopeSelector.types";

type GitHubStoreState = {
  github: GitHubState;
};

export function GitHubScopeSelector(_props: GitHubScopeSelectorProps) {
  const t = useTranslations("GitHub");
  const dispatch = useDispatch();
  const scopes = useSelector((state: GitHubStoreState) => selectSortedScopes(state));
  const selectedScopeId = useSelector(
    (state: GitHubStoreState) => state.github.selectedScopeId,
  );

  return (
    <div
      className="flex flex-wrap items-center gap-2.5"
      role="group"
      aria-label={t("scopeSelectorLabel")}
    >
      <button
        type="button"
        aria-pressed={selectedScopeId === null}
        onClick={() => dispatch(setSelectedScope(null))}
        className={[
          "inline-flex cursor-pointer items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200",
          selectedScopeId === null
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary",
        ].join(" ")}
      >
        {t("allScopes")}
      </button>
      {scopes.map((scope) => {
        const isActive = selectedScopeId === scope.id;

        return (
          <button
            key={scope.id}
            type="button"
            aria-pressed={isActive}
            onClick={() => dispatch(setSelectedScope(scope.id))}
            className={[
              "inline-flex cursor-pointer items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200",
              isActive
                ? "border-accent bg-accent text-accent-foreground"
                : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary",
            ].join(" ")}
          >
            {scope.name}
          </button>
        );
      })}
    </div>
  );
}
