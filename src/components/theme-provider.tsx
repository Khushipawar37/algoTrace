"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type ThemeName = "light" | "dark";

type ThemeContextValue = {
  resolvedTheme: ThemeName;
  setTheme: (theme: ThemeName) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [resolvedTheme, setResolvedTheme] = useState<ThemeName>("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("AlgoTrace-theme");
    if (stored === "light" || stored === "dark") {
      setResolvedTheme(stored);
      return;
    }

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setResolvedTheme(prefersDark ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", resolvedTheme === "dark");
    window.localStorage.setItem("AlgoTrace-theme", resolvedTheme);
  }, [resolvedTheme]);

  const value = useMemo(
    () => ({
      resolvedTheme,
      setTheme: setResolvedTheme,
    }),
    [resolvedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
