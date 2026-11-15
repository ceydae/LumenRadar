type Series = { label: string; color: string; data: number[] };

function buildPath(data: number[], w: number, h: number, pad: number, max: number): string {
  const step = (w - pad * 2) / (data.length - 1);
  return data
    .map((v, i) => {
      const x = pad + i * step;
      const y = h - pad - (v / max) * (h - pad * 2);
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildArea(data: number[], w: number, h: number, pad: number, max: number): string {
  const line = buildPath(data, w, h, pad, max);
  return `${line} L${(w - pad).toFixed(1)},${h - pad} L${pad},${h - pad} Z`;
}

export function TrendChart({
  series,
  labels,
  height = 180,
}: {
  series: Series[];
  labels: string[];
  height?: number;
}) {
  const w = 560;
  const pad = 24;
  const max = Math.max(...series.flatMap((s) => s.data)) * 1.15;
  const gridLines = [0.25, 0.5, 0.75, 1];

  return (
    <svg viewBox={`0 0 ${w} ${height}`} className="h-auto w-full" role="img" aria-label="Usage trend chart">
      <defs>
        {series.map((s, i) => (
          <linearGradient key={s.label} id={`fade-${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={s.color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={s.color} stopOpacity="0" />
          </linearGradient>
        ))}
      </defs>
      {gridLines.map((g) => {
        const y = pad + (1 - g) * (height - pad * 2);
        return <line key={g} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#d7e5f9" strokeWidth="1" strokeDasharray="3 5" />;
      })}
      {series.map((s, i) => (
        <g key={s.label}>
          <path d={buildArea(s.data, w, height, pad, max)} fill={`url(#fade-${i})`} />
          <path
            d={buildPath(s.data, w, height, pad, max)}
            fill="none"
            stroke={s.color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
      {labels.map((l, i) => {
        const x = pad + (i * (w - pad * 2)) / (labels.length - 1);
        return (
          <text key={l} x={x} y={height - 6} textAnchor="middle" fontSize="10" fill="#4c629a">
            {l}
          </text>
        );
      })}
    </svg>
  );
}

export function BarRow({ label, value, pct, color }: { label: string; value: string; pct: number; color: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-3">
        <span className="truncate text-[13px] font-medium text-navy-800">{label}</span>
        <span className="shrink-0 text-[13px] tabular-nums text-navy-800/60">{value}</span>
      </div>
      <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-ice-100">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

export function Donut({
  segments,
  size = 132,
}: {
  segments: { label: string; pct: number; color: string }[];
  size?: number;
}) {
  const r = 46;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Traffic sources chart">
        <circle cx="60" cy="60" r={r} fill="none" stroke="#e8f0fc" strokeWidth="14" />
        {segments.map((s) => {
          const dash = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx="60"
              cy="60"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth="14"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
              transform="rotate(-90 60 60)"
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <ul className="space-y-2">
        {segments.map((s) => (
          <li key={s.label} className="flex items-center gap-2 text-[13px] text-navy-800/80">
            <span className="h-2.5 w-2.5 rounded-[4px]" style={{ background: s.color }} />
            <span className="font-medium text-navy-800">{s.label}</span>
            <span className="tabular-nums text-navy-800/55">{s.pct}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
