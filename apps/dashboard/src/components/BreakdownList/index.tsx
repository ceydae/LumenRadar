import { formatNumber } from "@/utils/format";

interface Props {
  rows: { label: string; value: number }[];
  valueLabel: string;
  nameLabel: string;
}

export default function BreakdownList({ rows, valueLabel, nameLabel }: Props) {
  const max = Math.max(...rows.map((row) => row.value), 1);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  return (
    <div className="breakdown">
      <div className="breakdown-labels">
        <span>{nameLabel}</span>
        <span>{valueLabel}</span>
        <span>Share of listed</span>
      </div>
      <ul>
        {rows.map((row) => (
          <li key={row.label}>
            <span className="breakdown-name">{row.label}</span>
            <span className="breakdown-value">{formatNumber(row.value)}</span>
            <span className="breakdown-share">
              <span className="breakdown-meter" aria-hidden="true">
                <span style={{ width: `${(row.value / max) * 100}%` }} />
              </span>
              {total ? ((row.value / total) * 100).toFixed(1) : "0.0"}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
