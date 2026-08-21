"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { useTranslations } from "next-intl";
import { Provider, useDispatch, useSelector } from "react-redux";
import { EmptyState } from "@portfolio/components/ui/EmptyState";
import { ErrorState } from "@portfolio/components/ui/ErrorState";
import { LoadingState } from "@portfolio/components/ui/LoadingState";
import { RemoteDataStatus } from "@portfolio/components/ui/RemoteDataStatus";
import { Section } from "@portfolio/components/ui/Section";
import { GitHubDashboard } from "@portfolio/features/github/components/GitHubDashboard";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
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
  const t = useTranslations("GitHub");

  return (
    <Section
      aria-label={t("dashboardTitle")}
      title={t("dashboardTitle")}
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
  const t = useTranslations("GitHub");
  const dispatch = useDispatch<GitHubDashboardStore["dispatch"]>();
  const githubState = useSelector((state: GitHubDashboardRootState) => state.github);
  const status = useSelector((state: GitHubDashboardRootState) => state.github.status);
  const repositories = useSelector((state: GitHubDashboardRootState) =>
    selectRepositoriesForActiveScope(state),
  );

  useEffect(() => {
    logGitHubLifecycle("GitHubDashboardContainerContent");
    logGitHubDebug("Initial scopes:", initialScopes);
    dispatch(setScopes(initialScopes));
    dispatch(setStatus("success"));
  }, [dispatch, initialScopes]);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

  useEffect(() => {
    logGitHubDebug("Selected repos:", repositories);
  }, [repositories]);

  if (status === "loading" || status === "idle") {
    return (
      <GitHubDashboardStateFrame>
        <LoadingState
          label={t("loadingLabel")}
          description={t("loadingDescription")}
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  if (status === "error") {
    return (
      <GitHubDashboardStateFrame>
        <ErrorState
          title={t("errorTitle")}
          description={t("errorDescription")}
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  if (repositories.length === 0) {
    return (
      <GitHubDashboardStateFrame>
        <EmptyState
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          className="min-h-[32rem]"
        />
      </GitHubDashboardStateFrame>
    );
  }

  const usesLastKnownGood = repositories.some(
    (repository) => repository.data_source === "last-known-good",
  );

  return (
    <>
      {usesLastKnownGood && (
        <RemoteDataStatus
          contract={{
            status: "available",
            freshness: "stale",
            source: "last-known-good",
          }}
          messages={{
            loading: t("loadingLabel"),
            emptyTitle: t("emptyTitle"),
            emptyDescription: t("emptyDescription"),
            staleTitle: t("staleTitle"),
            staleDescription: t("staleDescription"),
            lastKnownGoodDescription: t("lastKnownGoodDescription"),
            errorTitle: t("errorTitle"),
            errorDescription: t("errorDescription"),
          }}
          className="mx-4 mt-8 sm:mx-8"
        />
      )}
      <GitHubDashboard />
    </>
  );
}

export function GitHubDashboardContainer({
  initialScopes,
}: GitHubDashboardContainerProps) {
  const [store] = useState<GitHubDashboardStore>(() => {
    logGitHubDebug("Initial scopes:", initialScopes);
    return createGitHubDashboardStore({
      github: {
        scopes: initialScopes,
        selectedScopeId: null,
        status: "success",
      },
    });
  });

  return (
    <Provider store={store}>
      <GitHubDashboardContainerContent initialScopes={initialScopes} />
    </Provider>
  );
}
