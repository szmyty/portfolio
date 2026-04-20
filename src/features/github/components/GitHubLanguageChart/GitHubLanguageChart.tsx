"use client";

import { useSelector } from "react-redux";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { selectRepositoriesForActiveScope } from "@portfolio/features/github/store/github.selectors";
import type { GitHubState } from "@portfolio/features/github/store/github.slice";
import type { GitHubLanguageChartProps } from "./GitHubLanguageChart.types";

type GitHubStoreState = {
  github: GitHubState;
};

type LanguageDatum = {
  name: string;
  value: number;
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

function buildLanguageData(state: GitHubStoreState): LanguageDatum[] {
  const repositories = selectRepositoriesForActiveScope(state);
  const distribution = repositories.reduce<Record<string, number>>((languages, repository) => {
    if (!repository.language) {
      return languages;
    }

    languages[repository.language] = (languages[repository.language] ?? 0) + 1;
    return languages;
  }, {});

  return Object.entries(distribution)
    .map(([name, value]) => ({ name, value }))
    .sort((left, right) => right.value - left.value || left.name.localeCompare(right.name));
}

export function GitHubLanguageChart(_props: GitHubLanguageChartProps) {
  const languageData = useSelector(buildLanguageData);

  return (
    <div className="rounded-3xl border border-border bg-surface px-5 py-6 shadow-sm sm:px-6 sm:py-7">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold tracking-tight text-text-primary">
            Language Distribution
          </h3>
          <p className="mt-1 text-sm text-text-muted">
            Repository counts by primary language for the active GitHub scope.
          </p>
        </div>
      </div>

      {languageData.length === 0 ? (
        <div className="flex min-h-80 items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 px-6 text-center text-sm text-text-muted">
          No language data available for the selected scope.
        </div>
      ) : (
        <div className="h-80 w-full sm:h-84">
          <ResponsiveContainer width="100%" height="100%">
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
                formatter={(value) => [`${value ?? 0}`, "Repositories"]}
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
      )}
    </div>
  );
}
