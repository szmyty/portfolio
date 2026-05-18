"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import {
  selectLanguageChartData,
  selectRepositoriesForActiveScope,
} from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubLanguageChartProps } from "./GitHubLanguageChart.types";

type GitHubStoreState = {
  github: GitHubState;
};

const CHART_COLORS = [
  "#7c9cff",
  "#5ec2b7",
  "#f59e0b",
  "#f97373",
  "#c084fc",
  "#38bdf8",
  "#a3e635",
  "#fb7185",
] as const;

export function GitHubLanguageChart(_props: GitHubLanguageChartProps) {
  const t = useTranslations("GitHub");
  const githubState = useSelector((state: GitHubStoreState) => state.github);
  const repositories = useSelector((state: GitHubStoreState) =>
    selectRepositoriesForActiveScope(state),
  );
  const languageData = useSelector((state: GitHubStoreState) => selectLanguageChartData(state));

  useEffect(() => {
    logGitHubLifecycle("GitHubLanguageChart");
  }, []);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

  useEffect(() => {
    logGitHubDebug("Selected repos:", repositories);
  }, [repositories]);

  useEffect(() => {
    logGitHubDebug("Language chart data:", languageData);
  }, [languageData]);

  if (!languageData.length) {
    return null;
  }

  return (
    <div className="flex h-full min-w-0 flex-col rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            {t("languageChart.title")}
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {t("languageChart.description")}
          </p>
        </div>
      </div>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <PieChart>
            <Pie
              data={languageData}
              dataKey="value"
              nameKey="name"
              innerRadius={62}
              outerRadius={108}
              paddingAngle={3}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={1}
              isAnimationActive
              animationDuration={500}
            >
              {languageData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => [`${value ?? 0}`, t("languageChart.repositories")]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid var(--border)",
                background: "color-mix(in srgb, var(--surface) 92%, transparent)",
                color: "var(--text-primary)",
              }}
            />
            <Legend
              verticalAlign="bottom"
              wrapperStyle={{
                paddingTop: "16px",
                color: "var(--text-secondary)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
