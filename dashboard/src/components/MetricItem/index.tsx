import type { Metric } from "@/types/analytics";
import InfoTooltip from "@/components/InfoTooltip";

export default function MetricItem({ label, value, description }: Metric) {
  return (
    <div className="metric-item">
      <div className="metric-label">
        {label}
        <InfoTooltip label={`About ${label.toLowerCase()}`}>
          {description}
        </InfoTooltip>
      </div>
      <p className="metric-value">{value}</p>
    </div>
  );
}
