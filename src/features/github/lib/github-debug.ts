import { isDev } from "@portfolio/config";

export function logGitHubDebug(label: string, payload?: unknown) {
  if (!isDev) {
    return;
  }

  if (payload === undefined) {
    console.log(`[GitHub Debug] ${label}`);
    return;
  }

  console.log(`[GitHub Debug] ${label}`, payload);
}

export function logGitHubLifecycle(componentName: string, event = "mounted") {
  logGitHubDebug(`${componentName} ${event}`);
}
