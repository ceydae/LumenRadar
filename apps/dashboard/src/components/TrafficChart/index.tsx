"use client";

import {
  CartesianGrid,
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { MetricKey, TrafficPoint } from "@/types/analytics";
import { formatCompact, formatNumber } from "@/utils/format";

const dateLabel = (value: string) =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(new Date(value));

export default function TrafficChart({
  points,
  metric,
  label,
}: {
  points: TrafficPoint[];
  metric: MetricKey;
  label: string;
}) {
  return (
    <div
      className="traffic-chart"
      role="img"
      aria-label={`${label} from ${dateLabel(points[0].date)} to ${dateLabel(points[points.length - 1].date)}. Daily values are available in the data table below.`}
    >
      <ResponsiveContainer width="100%" height="100%" minWidth={0}>
        <AreaChart
          data={points}
          margin={{ top: 16, right: 12, left: -18, bottom: 6 }}
          accessibilityLayer
        >
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tickFormatter={dateLabel}
            axisLine={false}
            tickLine={false}
            minTickGap={55}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            dy={12}
          />
          <YAxis
            tickFormatter={formatCompact}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            tickCount={5}
          />
          <Tooltip
            labelFormatter={(value) => dateLabel(String(value))}
            formatter={(value) => [formatNumber(Number(value)), label]}
            contentStyle={{
              border: "1px solid var(--border)",
              borderRadius: 10,
              fontSize: 12,
              color: "var(--foreground)",
              background: "var(--surface)",
              boxShadow: "0 8px 24px #0b275710",
            }}
          />
          <Area
            type="monotone"
            dataKey={metric}
            stroke="var(--primary)"
            fill="var(--chart-fill)"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 5, strokeWidth: 3, stroke: "var(--surface)" }}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
