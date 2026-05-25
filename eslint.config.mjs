import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  prettier,
  // Explicitly set React version to avoid eslint-plugin-react's version
  // detection code path, which calls context.getFilename() — an API removed
  // in ESLint v10. Setting an explicit version bypasses the 'detect' logic.
  {
    settings: {
      react: {
        version: "19",
      },
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Storybook build output:
    "storybook-static/**",
  ]),
]);

export default eslintConfig;
