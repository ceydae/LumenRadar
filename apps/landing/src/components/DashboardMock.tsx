import { Activity, BarChart3, Globe, LayoutDashboard, Server, Settings } from 'lucide-react';
import CountUp from './CountUp';
import StatusBadge from './StatusBadge';
import { BarRow, Donut, TrendChart } from './charts';

const nav = [
  { icon: LayoutDashboard, label: 'Overview', active: true },
  { icon: Globe, label: 'Web analytics', active: false },
  { icon: Server, label: 'API analytics', active: false },
  { icon: BarChart3, label: 'Reports', active: false },
  { icon: Settings, label: 'Settings', active: false },
];

const kpis = [
  { label: 'Unique visitors', to: 12847, delta: '+8.2%', up: true },
  { label: 'Page views', to: 38204, delta: '+12.4%', up: true },
  { label: 'API requests', to: 1248392, delta: '+5.1%', up: true, compact: true },
  { label: 'Avg. latency', to: 184, suffix: ' ms', delta: '-3.6%', up: false },
];

const topPages = [
  { label: '/docs/getting-started', value: '6,214', pct: 92 },
  { label: '/wallet/connect', value: '4,908', pct: 74 },
  { label: '/explorer', value: '3,881', pct: 58 },
  { label: '/blog/protocol-upgrade', value: '2,730', pct: 41 },
  { label: '/pricing', value: '1,945', pct: 29 },
];

const sources = [
  { label: 'Direct', pct: 38, color: '#244a97' },
  { label: 'Search', pct: 27, color: '#5b85de' },
  { label: 'Stellar community', pct: 18, color: '#3fd6c9' },
  { label: 'Social', pct: 11, color: '#9dbbf5' },
  { label: 'Other', pct: 6, color: '#d7e5f9' },
];

const endpoints = [
  { path: 'GET /v1/accounts', p50: 96, status: '2xx', tone: '#17b8ab' },
  { path: 'POST /v1/tx/submit', p50: 212, status: '2xx', tone: '#17b8ab' },
  { path: 'GET /v1/assets/{code}', p50: 148, status: '2xx', tone: '#17b8ab' },
  { path: 'GET /v1/trades', p50: 321, status: '4xx', tone: '#f5b544' },
];

const webSeries = [
  { label: 'Page views', color: '#3563c4', data: [42, 55, 49, 68, 74, 66, 88, 92, 84, 105, 118, 126] },
  { label: 'API requests', color: '#3fd6c9', data: [24, 31, 28, 39, 44, 41, 52, 61, 58, 66, 74, 83] },
];
const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8', 'W9', 'W10', 'W11', 'W12'];

export default function DashboardMock() {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10 bg-white text-left shadow-card ring-1 ring-navy-950/20">
      {/* browser chrome */}
      <div className="flex items-center gap-3 border-b border-ice-100 bg-ice-50 px-4 py-2.5">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#f16d6d]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#f5b544]" />
          <span className="h-2.5 w-2.5 rounded-full bg-signal-400" />
        </div>
        <div className="mx-auto flex w-full max-w-xs items-center justify-center gap-1.5 rounded-md bg-white px-3 py-1 text-[11px] font-medium text-navy-800/60 ring-1 ring-ice-200">
          <Activity className="h-3 w-3 text-signal-500" />
          dashboard.lumenradar.org
        </div>
        <div className="hidden w-10 sm:block" />
      </div>

      <div className="grid md:grid-cols-[180px_1fr]">
        {/* sidebar */}
        <aside className="hidden flex-col gap-1 border-r border-ice-100 bg-navy-950 p-3 md:flex">
          <div className="mb-3 flex items-center gap-2 px-2 pt-1">
            <img src="/brand/symbol-white.svg" alt="" className="h-5 w-5" />
            <span className="text-[13px] font-bold tracking-wide text-white">Lumen Radar</span>
          </div>
          {nav.map((item) => (
            <div
              key={item.label}
              className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-[12.5px] font-medium ${
                item.active ? 'bg-blue-600/25 text-white' : 'text-blue-200/55 hover:text-blue-200'
              }`}
            >
              <item.icon className="h-3.5 w-3.5" />
              {item.label}
            </div>
          ))}
          <div className="mt-auto rounded-lg border border-white/10 bg-white/5 p-2.5">
            <p className="text-[10px] font-semibold tracking-wider text-signal-400 uppercase">Project</p>
            <p className="mt-0.5 truncate text-[12px] font-medium text-white">Your Stellar project</p>
          </div>
        </aside>

        {/* main panel */}
        <div className="space-y-4 p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-[15px] font-bold text-navy-900">Web & API reporting roadmap</h3>
              <p className="text-[12px] text-navy-800/55">Planned reports for your project</p>
            </div>
            <StatusBadge tone="planned">Planned reporting</StatusBadge>
          </div>

          {/* KPI cards */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {kpis.map((k) => (
              <div key={k.label} className="rounded-xl border border-ice-200 bg-white p-3.5 shadow-lift">
                <p className="text-[11px] font-semibold tracking-wider text-navy-800/50 uppercase">{k.label}</p>
                <p className="mt-1 text-xl font-extrabold text-navy-900 tabular-nums sm:text-2xl">
                  <CountUp
                    to={k.to}
                    separator=","
                    duration={1.6}
                    format={k.compact ? 'compact' : 'standard'}
                    suffix={k.suffix ?? ''}
                  />
                </p>
                <p className={`mt-0.5 text-[11.5px] font-semibold ${k.up ? 'text-signal-500' : 'text-blue-500'}`}>
                  {k.delta} vs prev. period
                </p>
              </div>
            ))}
          </div>

          {/* trend chart */}
          <div className="rounded-xl border border-ice-200 bg-white p-4 shadow-lift">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[13px] font-bold text-navy-900">Web & API activity</p>
              <div className="flex items-center gap-4 text-[11px] font-medium text-navy-800/60">
                {webSeries.map((s) => (
                  <span key={s.label} className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
            <TrendChart series={webSeries} labels={weeks} />
          </div>

          {/* bottom row */}
          <div className="grid gap-3 lg:grid-cols-3">
            <div className="rounded-xl border border-ice-200 bg-white p-4 shadow-lift">
              <p className="mb-3 text-[13px] font-bold text-navy-900">Top pages</p>
              <div className="space-y-3">
                {topPages.map((p) => (
                  <BarRow key={p.label} label={p.label} value={p.value} pct={p.pct} color="#3563c4" />
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-ice-200 bg-white p-4 shadow-lift">
              <p className="mb-3 text-[13px] font-bold text-navy-900">Traffic sources</p>
              <Donut segments={sources} />
            </div>
            <div className="rounded-xl border border-ice-200 bg-white p-4 shadow-lift">
              <p className="mb-3 text-[13px] font-bold text-navy-900">Endpoint latency</p>
              <ul className="space-y-2.5">
                {endpoints.map((e) => (
                  <li key={e.path} className="flex items-center justify-between gap-2">
                    <span className="truncate font-mono text-[11.5px] text-navy-800/80">{e.path}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <span
                        className="rounded-full px-1.5 py-0.5 text-[10px] font-bold"
                        style={{ background: `${e.tone}1f`, color: e.tone === '#f5b544' ? '#8a5d0b' : e.tone }}
                      >
                        {e.status}
                      </span>
                      <span className="text-[12px] font-semibold text-navy-900 tabular-nums">{e.p50} ms</span>
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 rounded-lg bg-ice-50 p-2.5 text-[11px] leading-relaxed text-navy-800/60">
                Request volume, status classes and latency, broken down per endpoint.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
