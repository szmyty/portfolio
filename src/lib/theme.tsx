"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import type { ReactNode } from "react";
import { THEME_STORAGE_KEY } from "@portfolio/lib/storageKeys";

export type ThemeMode = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  /** User-selected preference: "light", "dark", or "system". */
  theme: ThemeMode;
  /** Actual resolved theme after applying system preference. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
};

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  resolvedTheme: "dark",
  setTheme: () => {},
});

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function resolveTheme(mode: ThemeMode): ResolvedTheme {
  return mode === "system" ? getSystemTheme() : mode;
}

function readStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "dark";

  try {
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    return storedTheme === "light" ||
      storedTheme === "dark" ||
      storedTheme === "system"
      ? storedTheme
      : "dark";
  } catch {
    return "dark";
  }
}

/** Apply the resolved theme to the <html> element. */
function applyTheme(resolved: ResolvedTheme) {
  const root = document.documentElement;
  if (resolved === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

type ThemeProviderProps = {
  children: ReactNode;
};

const THEME_CHANGE_EVENT = "portfolio-theme-change";

function subscribeToTheme(callback: () => void): () => void {
  const handleChange = () => callback();
  window.addEventListener("storage", handleChange);
  window.addEventListener(THEME_CHANGE_EVENT, handleChange);

  return () => {
    window.removeEventListener("storage", handleChange);
    window.removeEventListener(THEME_CHANGE_EVENT, handleChange);
  };
}

function subscribeToSystemTheme(callback: () => void): () => void {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
  mediaQuery.addEventListener("change", callback);

  return () => mediaQuery.removeEventListener("change", callback);
}

function getServerTheme(): ThemeMode {
  return "dark";
}

function getServerSystemTheme(): ResolvedTheme {
  return "dark";
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // useSyncExternalStore keeps the server snapshot stable through the first
  // client render, then synchronizes the persisted preference after hydration.
  const theme = useSyncExternalStore(
    subscribeToTheme,
    readStoredTheme,
    getServerTheme,
  );
  const systemTheme = useSyncExternalStore(
    subscribeToSystemTheme,
    getSystemTheme,
    getServerSystemTheme,
  );
  const resolvedTheme = theme === "system" ? systemTheme : resolveTheme(theme);

  // Sync DOM attribute whenever the resolved theme changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((newMode: ThemeMode) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, newMode);
    } catch {
      // Storage can be unavailable in privacy-restricted browsing contexts.
    }
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
