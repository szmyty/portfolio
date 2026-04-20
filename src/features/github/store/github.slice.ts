import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GitHubScope } from "@portfolio/features/github/types";

export type GitHubStatus = "idle" | "loading" | "success" | "error";

export type GitHubState = {
  scopes: GitHubScope[];
  selectedScopeId: string | null;
  status: GitHubStatus;
};

const initialState: GitHubState = {
  scopes: [],
  selectedScopeId: null,
  status: "idle",
};

const githubSlice = createSlice({
  name: "github",
  initialState,
  reducers: {
    setScopes(state, action: PayloadAction<GitHubScope[]>) {
      state.scopes = action.payload;
    },
    setSelectedScope(state, action: PayloadAction<string | null>) {
      state.selectedScopeId = action.payload;
    },
    setStatus(state, action: PayloadAction<GitHubStatus>) {
      state.status = action.payload;
    },
  },
});

export const { setScopes, setSelectedScope, setStatus } = githubSlice.actions;
export const githubReducer = githubSlice.reducer;
export { githubSlice };
