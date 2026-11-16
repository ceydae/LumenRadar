import { cn } from "@/utils/cn";

export default function Skeleton({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("skeleton", className)} />;
}
