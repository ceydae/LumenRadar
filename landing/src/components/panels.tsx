import StatusBadge from './StatusBadge';
import { BarRow, Donut, TrendChart } from './charts';

function PanelShell({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ice-200 bg-white shadow-card">
      <div className="flex items-center justify-between gap-2 border-b border-ice-100 px-5 py-3">
        <p className="text-[13px] font-bold text-navy-900">{title}</p>
        <StatusBadge tone="sample">Sample data</StatusBadge>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export function SourcesPanel() {
  return (
    <PanelShell title="Traffic sources · last 30 days">
      <Donut
        segments={[
          { label: 'Direct', pct: 38, color: '#244a97' },
          { label: 'Search', pct: 27, color: '#5b85de' },
          { label: 'Stellar community', pct: 18, color: '#3fd6c9' },
          { label: 'Social', pct: 11, color: '#9dbbf5' },
          { label: 'Other', pct: 6, color: '#d7e5f9' },
        ]}
      />
      <div className="mt-5 space-y-3 border-t border-ice-100 pt-4">
        <BarRow label="stellar.org · referral" value="2,412" pct={78} color="#3fd6c9" />
        <BarRow label="discord.gg/stellar" value="1,208" pct={46} color="#3fd6c9" />
        <BarRow label="github.com" value="984" pct={35} color="#3fd6c9" />
      </div>
    </PanelShell>
  );
}

export function TopContentPanel() {
  return (
    <PanelShell title="Most used · pages and endpoints">
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-wider text-navy-800/50 uppercase">Top pages</p>
          <div className="space-y-3">
            <BarRow label="/docs/getting-started" value="6,214" pct={92} color="#3563c4" />
            <BarRow label="/wallet/connect" value="4,908" pct={74} color="#3563c4" />
            <BarRow label="/explorer" value="3,881" pct={58} color="#3563c4" />
            <BarRow label="/pricing" value="1,945" pct={29} color="#3563c4" />
          </div>
        </div>
        <div>
          <p className="mb-3 text-[11px] font-bold tracking-wider text-navy-800/50 uppercase">Top endpoints</p>
          <div className="space-y-3">
            <BarRow label="GET /v1/accounts" value="412K" pct={95} color="#3fd6c9" />
            <BarRow label="POST /v1/tx/submit" value="238K" pct={62} color="#3fd6c9" />
            <BarRow label="GET /v1/assets/{code}" value="164K" pct={44} color="#3fd6c9" />
            <BarRow label="GET /v1/trades" value="91K" pct={26} color="#3fd6c9" />
          </div>
        </div>
      </div>
    </PanelShell>
  );
}

export function TrendPanel() {
  return (
    <PanelShell title="Usage over time · weekly">
      <TrendChart
        height={190}
        labels={['W1', 'W3', 'W5', 'W7', 'W9', 'W11']}
        series={[
          { label: 'Visitors', color: '#3563c4', data: [8, 11, 10, 14, 13, 17, 16, 20, 23, 22, 27, 31] },
          { label: 'API calls', color: '#3fd6c9', data: [4, 5, 7, 6, 9, 11, 10, 13, 15, 17, 19, 24] },
        ]}
      />
      <div className="mt-3 flex flex-wrap gap-2 text-[11.5px] font-semibold">
        <span className="rounded-full bg-signal-400/10 px-2.5 py-1 text-signal-500">+38% visitors</span>
        <span className="rounded-full bg-signal-400/10 px-2.5 py-1 text-signal-500">+52% API calls</span>
        <span className="rounded-full bg-ice-100 px-2.5 py-1 text-navy-800/60">vs. previous 12 weeks</span>
      </div>
    </PanelShell>
  );
}
