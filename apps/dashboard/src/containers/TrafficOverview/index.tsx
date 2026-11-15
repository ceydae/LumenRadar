"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Tabs } from "@animate-ui/react/primitives/radix-ui/tabs";
import Panel from "@/components/Panel";
import TrafficChart from "@/components/TrafficChart";
import EmptyState from "@/components/EmptyState";
import type { MetricKey, TrafficPoint } from "@/types/analytics";
import { formatNumber } from "@/utils/format";

const metrics = [
  { value: "visitors", label: "Visitors" },
  { value: "pageviews", label: "Page views" },
  { value: "requests", label: "API requests" },
] as const;

export default function TrafficOverview({
  points,
  apiConnected,
  webConfigured,
  apiConfigured,
}: {
  points: TrafficPoint[];
  apiConnected: boolean;
  webConfigured: boolean;
  apiConfigured: boolean;
}) {
  const [metric, setMetric] = useState<MetricKey>(
    webConfigured ? "visitors" : "requests",
  );
  function download() {
    const csv = [
      "date,visitors,pageviews,requests",
      ...points.map(
        (point) =>
          `${point.date},${point.visitors},${point.pageviews},${apiConnected ? point.requests : ""}`,
      ),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = "lumen-radar-traffic.csv";
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <Tabs.Root
      value={metric}
      onValueChange={(value) => setMetric(value as MetricKey)}
      className="traffic-overview"
    >
      <Panel
        title="Activity over time"
        description="Daily website and API activity for the selected period."
        className="traffic-panel"
        action={
          <div className="chart-actions">
            <button
              className="secondary-button export-button"
              onClick={download}
              disabled={points.length === 0}
              aria-label="Download traffic as CSV"
            >
              <Download size={14} aria-hidden="true" />
              Export
            </button>
          </div>
        }
      >
        <div className="chart-toolbar">
          <Tabs.List className="metric-tabs" aria-label="Chart metric">
            {metrics.map((option) => (
              <Tabs.Trigger
                className="metric-tab"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
          <span className="chart-key-note">
            <span />
            Daily totals
          </span>
        </div>
        {metrics.map((option) => (
          <Tabs.Content
            key={option.value}
            value={option.value}
            className="chart-tab-content"
          >
            {points.length === 0 ? (
              <EmptyState
                title={
                  (option.value === "requests" ? apiConfigured : webConfigured)
                    ? "Your activity will appear here."
                    : option.value === "requests"
                      ? "No API source selected"
                      : "No website source selected"
                }
                description={
                  (option.value === "requests" ? apiConfigured : webConfigured)
                    ? "Reports will be available once this source starts sending data."
                    : "This data source has not been added to your project."
                }
              />
            ) : option.value === "requests" && !apiConnected ? (
              <EmptyState
                title="No API connected"
                description="API traffic will appear here once a service is connected."
              />
            ) : (
              <TrafficChart
                points={points}
                metric={option.value}
                label={option.label}
              />
            )}
          </Tabs.Content>
        ))}
        {points.length > 0 && (
          <details className="chart-data">
            <summary>View daily data</summary>
            <div className="table-scroll">
              <table>
                <caption className="sr-only">Daily traffic</caption>
                <thead>
                  <tr>
                    <th scope="col">Date (UTC)</th>
                    <th scope="col">Visitors</th>
                    <th scope="col">Page views</th>
                    <th scope="col">API requests</th>
                  </tr>
                </thead>
                <tbody>
                  {points.map((point) => (
                    <tr key={point.date}>
                      <th scope="row">{point.date}</th>
                      <td>{formatNumber(point.visitors)}</td>
                      <td>{formatNumber(point.pageviews)}</td>
                      <td>
                        {apiConnected
                          ? formatNumber(point.requests)
                          : "Not connected"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </details>
        )}
      </Panel>
    </Tabs.Root>
  );
}
