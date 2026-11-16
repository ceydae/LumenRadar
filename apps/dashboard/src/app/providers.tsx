"use client";

import { AnimateUIProvider } from "@animate-ui/react/provider";
import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem storageKey="lumen-radar-dashboard-theme" disableTransitionOnChange>
      <AnimateUIProvider reducedMotion="user">{children}</AnimateUIProvider>
    </ThemeProvider>
  );
}
