export type DateRange = "all" | "7d" | "30d";
export type MetricKey = "visitors" | "pageviews" | "requests";

export interface TrafficPoint {
  date: string;
  visitors: number;
  pageviews: number;
  requests: number;
}

export interface Project {
  id: string;
  name: string;
  domain: string;
  initials: string;
  apiConnected: boolean;
  webConnected: boolean;
  webConfigured: boolean;
  apiConfigured: boolean;
  serviceName?: string;
  traffic: TrafficPoint[];
  pages: { path: string; views: number }[];
  sources: { name: string; visitors: number }[];
}

export interface Metric {
  label: string;
  value: string;
  description: string;
}
