import MetricItem from "@/components/MetricItem";
import type { Metric } from "@/types/analytics";

export default function MetricsSummary({ metrics }: { metrics: Metric[] }) {
  return (
    <section className="metrics-summary" aria-label="Usage summary">
      {metrics.map((metric) => (
        <MetricItem key={metric.label} {...metric} />
      ))}
    </section>
  );
}
