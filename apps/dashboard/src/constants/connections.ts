import { Cable, Globe2, Layers2 } from "lucide-react";
import type { ConnectionMode } from "@/types/workspace";

export const connectionOptions: {
  value: ConnectionMode;
  label: string;
  description: string;
  icon: typeof Globe2;
}[] = [
  {
    value: "web",
    label: "Website analytics",
    description: "Pages, visitors and where your traffic comes from.",
    icon: Globe2,
  },
  {
    value: "api",
    label: "API analytics",
    description: "Requests, response status and service latency.",
    icon: Cable,
  },
  {
    value: "both",
    label: "Website & API",
    description: "Keep website activity and API usage together.",
    icon: Layers2,
  },
];
