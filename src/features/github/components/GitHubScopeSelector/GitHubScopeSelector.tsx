"use client";

import { useDispatch, useSelector } from "react-redux";
import { setSelectedScope, type GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubScope } from "@portfolio/features/github/types";
import type { GitHubScopeSelectorProps } from "./GitHubScopeSelector.types";

type GitHubStoreState = {
  github: GitHubState;
};

const SCOPE_ORDER: Record<string, number> = {
  egohygiene: 0,
  incomprisllc: 1,
  szmyty: 2,
};

function sortScopes(scopes: GitHubScope[]): GitHubScope[] {
  return [...scopes].sort((left, right) => {
    const leftOrder = SCOPE_ORDER[left.id] ?? Number.MAX_SAFE_INTEGER;
    const rightOrder = SCOPE_ORDER[right.id] ?? Number.MAX_SAFE_INTEGER;

    if (leftOrder !== rightOrder) {
      return leftOrder - rightOrder;
    }

    return left.name.localeCompare(right.name);
  });
}

export function GitHubScopeSelector(_props: GitHubScopeSelectorProps) {
  const dispatch = useDispatch();
  const scopes = useSelector((state: GitHubStoreState) => sortScopes(state.github.scopes));
  const selectedScopeId = useSelector(
    (state: GitHubStoreState) => state.github.selectedScopeId,
  );

  return (
    <div
      className="flex flex-wrap items-center gap-2.5"
      role="tablist"
      aria-label="GitHub scopes"
    >
      <button
        type="button"
        role="tab"
        aria-selected={selectedScopeId === null}
        onClick={() => dispatch(setSelectedScope(null))}
        className={[
          "inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200",
          selectedScopeId === null
            ? "border-accent bg-accent text-accent-foreground"
            : "border-border bg-surface text-text-secondary hover:border-accent hover:text-text-primary",
        ].join(" ")}
      >
        All
      </button>
      {scopes.map((scope) => {
        const isActive = selectedScopeId === scope.id;

        return (
          <button
            key={scope.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => dispatch(setSelectedScope(scope.id))}
            className={[
              "inline-flex items-center rounded-full border px-4 py-2.5 text-sm font-medium transition-colors duration-200",
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
