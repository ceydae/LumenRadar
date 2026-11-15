import type { ReactNode } from "react";
import { cn } from "@/utils/cn";

export default function Badge({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: "neutral" | "success" | "accent";
}) {
  return <span className={cn("badge", `badge-${tone}`)}>{children}</span>;
}
