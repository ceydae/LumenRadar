import { ArrowUpRight, Globe2, Clock3 } from "lucide-react";
import ConnectionsSummary from "@/containers/ConnectionsSummary";
import MetricsSummary from "@/containers/MetricsSummary";
import TrafficOverview from "@/containers/TrafficOverview";
import TrafficBreakdowns from "@/containers/TrafficBreakdowns";
import type { DateRange, Metric, Project } from "@/types/analytics";
import { formatNumber } from "@/utils/format";

export default function Overview({
  project,
  range,
  onInspect,
}: {
  project: Project;
  range: DateRange;
  onInspect: () => void;
}) {
  const points = project.traffic.slice(range === "7d" ? -7 : -30);
  const total = (key: "visitors" | "pageviews" | "requests") =>
    points.reduce((sum, point) => sum + point[key], 0);
  const metrics: Metric[] = [
    {
      label: "Daily unique visitors",
      value: project.webConnected ? formatNumber(total("visitors")) : "—",
      description:
        "Sum of daily unique visitors. A person visiting on multiple days can be counted again.",
    },
    {
      label: "Page views",
      value: project.webConnected ? formatNumber(total("pageviews")) : "—",
      description: "Total page views in the selected period.",
    },
    {
      label: "API requests",
      value: project.apiConnected ? formatNumber(total("requests")) : "—",
      description:
        "Total requests received by the project's API. A dash means no API is connected.",
    },
    {
      label: "API latency · p95",
      value: project.apiConnected ? "142 ms" : "—",
      description: "95% of requests complete within this response time.",
    },
  ];
  return (
    <main id="main-content" className="overview">
      <div className="page-heading">
        <div>
          <h1>Project overview</h1>
          <p>Website activity and API usage for {project.name}.</p>
        </div>
        <div className="page-context">
          <span>
            <Globe2 size={14} aria-hidden="true" />
            {project.domain}
          </span>
          <button className="primary-button" onClick={onInspect}>
            View connections
            <ArrowUpRight size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
      <div className="summary-heading">
        <h2>Usage at a glance</h2>
        <span>
          {range === "7d" ? "Last 7 days" : "Last 30 days"}
          <span className="timezone-label">UTC</span>
        </span>
      </div>
      <MetricsSummary metrics={metrics} />
      <div className="analytics-grid">
        <TrafficOverview
          key={project.id}
          points={points}
          apiConnected={project.apiConnected}
          webConfigured={project.webConfigured}
          apiConfigured={project.apiConfigured}
        />
        <ConnectionsSummary project={project} onInspect={onInspect} />
      </div>
      <TrafficBreakdowns project={project} range={range} />
      <footer className="overview-footer">
        <span>
          <Clock3 size={12} aria-hidden="true" />
          Reporting timezone · UTC
        </span>
        <span>Privacy-first analytics for the Stellar ecosystem</span>
      </footer>
    </main>
  );
}
