"use client";

import { useEffect, useRef } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { Provider, useDispatch } from "react-redux";
import { githubReducer, setScopes } from "@portfolio/features/github/store/github.slice";
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

  return <div>GitHub Dashboard</div>;
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
