"use client";

import { AnimateUIProvider } from "@animate-ui/react/provider";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <AnimateUIProvider reducedMotion="user">{children}</AnimateUIProvider>;
}
