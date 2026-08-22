import { readFileSync } from "node:fs";
import { join } from "node:path";
import { defineConfig } from "@playwright/test";

const root = process.cwd();
const matrix = JSON.parse(
  readFileSync(
    join(root, "tests/application-readiness/fixtures/visual-matrix.json"),
    "utf8",
  ),
);

export default defineConfig({
  testDir: join(root, "tests/application-readiness/browser"),
  outputDir: join(root, "test-results/application-readiness"),
  timeout: 60_000,
  expect: { timeout: 10_000 },
  retries: 1,
  workers: 1,
  reporter: [
    ["list"],
    [
      "html",
      {
        outputFolder: "playwright-report/application-readiness",
        open: "never",
      },
    ],
  ],
  use: {
    baseURL: process.env.RELEASE_BASE_URL || "https://szmyty.vercel.app",
    browserName: "chromium",
    trace: "retain-on-failure",
  },
  projects: matrix.projects.map((project) => ({
    name: project.name,
    use: {
      viewport: project.viewport,
      colorScheme: project.colorScheme,
      reducedMotion: project.reducedMotion,
    },
  })),
});
