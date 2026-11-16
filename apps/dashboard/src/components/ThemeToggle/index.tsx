"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@animate-ui/react/primitives/buttons/button";

export default function ThemeToggle({ showLabel = false }: { showLabel?: boolean }) {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      type="button"
      className={showLabel ? "theme-toggle theme-toggle-labeled" : "theme-toggle"}
      aria-label="Toggle color theme"
      title="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <Moon className="theme-light" size={18} aria-hidden="true" />
      <Sun className="theme-dark" size={18} aria-hidden="true" />
      {showLabel && <span data-sidebar="group-label" className="sidebar-label">Appearance</span>}
    </Button>
  );
}
