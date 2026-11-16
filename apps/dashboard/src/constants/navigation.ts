import {
  Cable,
  ChartNoAxesCombined,
  Globe2,
  ChartPie,
  Settings2,
} from "lucide-react";

export const navigation = [
  { label: "Overview", icon: ChartPie, available: true },
  { label: "Web analytics", icon: Globe2, available: false },
  { label: "API analytics", icon: ChartNoAxesCombined, available: false },
  { label: "Connections", icon: Cable, available: false },
  { label: "Project settings", icon: Settings2, available: false },
] as const;
