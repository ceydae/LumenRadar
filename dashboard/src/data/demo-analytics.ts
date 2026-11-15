import type { Project, TrafficPoint } from "@/types/analytics";

// Deterministic fixtures only. These are not measurements of real Stellar projects.
function createTraffic(multiplier: number): TrafficPoint[] {
  return Array.from({ length: 30 }, (_, index) => {
    const date = new Date(Date.UTC(2026, 9, 17 + index));
    const visitors = Math.round(
      (530 +
        index * 14 +
        Math.sin(index * 1.7) * 110 +
        Math.cos(index * 0.6) * 70) *
        multiplier,
    );
    return {
      date: date.toISOString().slice(0, 10),
      visitors,
      pageviews: Math.round(visitors * (2.1 + Math.sin(index) * 0.2)),
      requests: Math.round(visitors * (27 + Math.cos(index) * 4)),
    };
  });
}

export const demoProjects: Project[] = [
  {
    id: "orbit",
    name: "Orbit",
    domain: "orbit.example",
    initials: "OR",
    apiConnected: true,
    webConnected: true,
    webConfigured: true,
    apiConfigured: true,
    traffic: createTraffic(1),
    pages: [
      { path: "/", views: 12480 },
      { path: "/app", views: 8932 },
      { path: "/swap", views: 6241 },
      { path: "/docs", views: 3120 },
    ],
    sources: [
      { name: "Direct", visitors: 7820 },
      { name: "Google", visitors: 5140 },
      { name: "stellar.org", visitors: 3210 },
      { name: "GitHub", visitors: 1840 },
    ],
  },
  {
    id: "meridian",
    name: "Meridian",
    domain: "meridian.example",
    initials: "MD",
    apiConnected: false,
    webConnected: true,
    webConfigured: true,
    apiConfigured: false,
    traffic: createTraffic(0.58).map((point) => ({ ...point, requests: 0 })),
    pages: [
      { path: "/", views: 6840 },
      { path: "/explore", views: 4140 },
      { path: "/about", views: 2860 },
      { path: "/docs", views: 1490 },
    ],
    sources: [
      { name: "Direct", visitors: 4210 },
      { name: "Google", visitors: 2840 },
      { name: "stellar.org", visitors: 1450 },
      { name: "GitHub", visitors: 920 },
    ],
  },
];

export const dateRanges = [
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
] as const;
