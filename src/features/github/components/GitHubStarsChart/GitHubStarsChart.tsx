"use client";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  logGitHubDebug,
  logGitHubLifecycle,
} from "@portfolio/features/github/lib/github-debug";
import {
  selectRepositoriesForActiveScope,
  selectStarsChartData,
} from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubStarsChartProps } from "./GitHubStarsChart.types";

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
] as const;

export function GitHubStarsChart(_props: GitHubStarsChartProps) {
  const t = useTranslations("GitHub");
  const githubState = useSelector((state: GitHubStoreState) => state.github);
  const repositories = useSelector((state: GitHubStoreState) =>
    selectRepositoriesForActiveScope(state),
  );
  const starsData = useSelector((state: GitHubStoreState) => selectStarsChartData(state));
  const hasStarData = starsData.some((entry) => entry.value > 0);

  useEffect(() => {
    logGitHubLifecycle("GitHubStarsChart");
  }, []);

  useEffect(() => {
    logGitHubDebug("GitHub state:", githubState);
  }, [githubState]);

  useEffect(() => {
    logGitHubDebug("Selected repos:", repositories);
  }, [repositories]);

  useEffect(() => {
    logGitHubDebug("Stars chart data:", starsData);
  }, [starsData]);

  if (!starsData.length || !hasStarData) {
    return null;
  }

  return (
    <div className="flex h-full min-w-0 flex-col rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            {t("starsChart.title")}
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            {t("starsChart.description")}
          </p>
        </div>
      </div>

      <div className="h-[320px] w-full min-w-0">
        <ResponsiveContainer width="100%" height={320} minWidth={0}>
          <BarChart data={starsData} margin={{ top: 8, right: 8, left: -16, bottom: 8 }}>
            <CartesianGrid stroke="rgba(148, 163, 184, 0.12)" vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            />
            <YAxis
              allowDecimals={false}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: "rgba(124, 156, 255, 0.08)" }}
              formatter={(value) => [`${value ?? 0}`, t("starsChart.stars")]}
              contentStyle={{
                borderRadius: "16px",
                border: "1px solid var(--border)",
                background: "color-mix(in srgb, var(--surface) 92%, transparent)",
                color: "var(--text-primary)",
              }}
            />
            <Bar
              dataKey="value"
              radius={[10, 10, 4, 4]}
              isAnimationActive
              animationDuration={500}
            >
              {starsData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
