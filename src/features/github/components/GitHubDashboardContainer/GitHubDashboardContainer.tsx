"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch, useSelector } from "react-redux";
import { EmptyState } from "@portfolio/components/ui/EmptyState";
import { ErrorState } from "@portfolio/components/ui/ErrorState";
import { LoadingState } from "@portfolio/components/ui/LoadingState";
import { Section } from "@portfolio/components/ui/Section";
import { GitHubDashboard } from "@portfolio/features/github/components/GitHubDashboard";
import {
  githubReducer,
  setScopes,
  setStatus,
  type GitHubState,
} from "@portfolio/features/github/store/github.slice";
import { selectRepositoriesForActiveScope } from "@portfolio/features/github/store/github.selectors";
import type { GitHubDashboardContainerProps } from "./GitHubDashboardContainer.types";

function createGitHubDashboardStore(preloadedState?: { github: GitHubState }) {
  return configureStore({
    reducer: {
      github: githubReducer,
    },
    preloadedState,
  });
}

type GitHubDashboardStore = ReturnType<typeof createGitHubDashboardStore>;
type GitHubDashboardRootState = ReturnType<GitHubDashboardStore["getState"]>;

function GitHubDashboardStateFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Section
      aria-label="GitHub Dashboard"
      title="GitHub Dashboard"
      background="surface"
      cosmicBackground={false}
      className="py-12 sm:py-16"
    >
      <div className="min-h-[32rem]">{children}</div>
    </Section>
  );
}

function GitHubDashboardContainerContent({
  initialScopes,
}: GitHubDashboardContainerProps) {
  const dispatch = useDispatch<GitHubDashboardStore["dispatch"]>();
  const status = useSelector((state: GitHubDashboardRootState) => state.github.status);
  const repositories = useSelector((state: GitHubDashboardRootState) =>
    selectRepositoriesForActiveScope(state),
  );

  useEffect(() => {
    dispatch(setScopes(initialScopes));
    dispatch(setStatus("success"));
  }, [dispatch, initialScopes]);

  if (status === "loading" || status === "idle") {
    return (
      <GitHubDashboardStateFrame>
        <LoadingState
          label="Loading GitHub dashboard"
          description="Fetching repositories and analytics for your GitHub scopes."
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  if (status === "error") {
    return (
      <GitHubDashboardStateFrame>
        <ErrorState
          title="Unable to load GitHub data"
          description="The GitHub dashboard could not be prepared. Please try again in a moment."
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  if (repositories.length === 0) {
    return (
      <GitHubDashboardStateFrame>
        <EmptyState
          title="No repositories available"
          description="There are no repositories to display for the selected GitHub scope yet."
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  return <GitHubDashboard />;
}

export function GitHubDashboardContainer({
  initialScopes,
}: GitHubDashboardContainerProps) {
  const storeRef = useRef<GitHubDashboardStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createGitHubDashboardStore({
      github: {
        scopes: initialScopes,
        selectedScopeId: null,
        status: "success",
      },
    });
  }

  return (
    <Provider store={storeRef.current}>
      <GitHubDashboardContainerContent initialScopes={initialScopes} />
    </Provider>
  );
}
