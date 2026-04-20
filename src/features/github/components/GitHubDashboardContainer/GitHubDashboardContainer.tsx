"use client";

import { useEffect, useRef } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import { githubReducer, setScopes } from "@portfolio/features/github/store/github.slice";
import { GitHubScopeSelector } from "@portfolio/features/github/components/GitHubScopeSelector";
import type { GitHubDashboardContainerProps } from "./GitHubDashboardContainer.types";

function createGitHubDashboardStore() {
  return configureStore({
    reducer: {
      github: githubReducer,
    },
  });
}

type GitHubDashboardStore = ReturnType<typeof createGitHubDashboardStore>;

function GitHubDashboardContainerContent({
  initialScopes,
}: GitHubDashboardContainerProps) {
  const dispatch = useDispatch<GitHubDashboardStore["dispatch"]>();

  useEffect(() => {
    dispatch(setScopes(initialScopes));
  }, [dispatch, initialScopes]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <GitHubScopeSelector />
      <div>GitHub Dashboard</div>
    </div>
  );
}

export function GitHubDashboardContainer({
  initialScopes,
}: GitHubDashboardContainerProps) {
  const storeRef = useRef<GitHubDashboardStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = createGitHubDashboardStore();
  }

  return (
    <Provider store={storeRef.current}>
      <GitHubDashboardContainerContent initialScopes={initialScopes} />
    </Provider>
  );
}
