import { Globe, Server, Check, Clock3 } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SpotlightCard from '../components/SpotlightCard';
import FadeContent from '../components/FadeContent';
import StatusBadge from '../components/StatusBadge';

const areas = [
  {
    icon: Globe,
    name: 'Web analytics',
    tagline: 'See how people find and use your site.',
    copy: 'Built on Umami. Start with website tracking and pageview counts, then follow the roadmap toward deeper insights into how people use your project.',
    ready: ['Website tracking script', 'Page views with date filters', 'Private project dashboard'],
    planned: ['Visitors, sessions and bounce rate', 'Top pages, referrers, countries and devices', 'Engagement, events and conversion funnels'],
  },
  {
    icon: Server,
    name: 'API analytics',
    tagline: 'Watch how your services are actually called.',
    copy: 'Planned OpenTelemetry integration will measure request volume, errors, and response times by endpoint, with dynamic routes grouped together.',
    ready: [],
    planned: ['Request counts per endpoint', 'Error rates and response status', 'Response times at p50 and p95'],
  },
];

export default function ProductAreas() {
  return (
    <section id="product" className="relative bg-ice-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="One radar, two signals"
          title="Web and API analytics, side by side."
          copy="Stellar projects live on two surfaces: the site people visit and the API developers call. Start with web analytics today; API analytics is next."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {areas.map((area, i) => (
            <FadeContent key={area.name} delay={i * 0.15} duration={0.9}>
              <SpotlightCard
                theme="light"
                spotlightColor="rgba(53, 99, 196, 0.18)"
                className="h-full rounded-2xl border border-ice-200 bg-white p-7 shadow-lift sm:p-9"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-navy-800 text-signal-400">
                    <area.icon className="h-6 w-6" />
                  </div>
                  <StatusBadge tone={area.ready.length ? 'live' : 'planned'}>{area.ready.length ? 'Available now' : 'Planned'}</StatusBadge>
                </div>

                <h3 className="mt-6 font-display text-2xl font-bold tracking-tight text-navy-900">{area.name}</h3>
                <p className="mt-1 text-[15px] font-semibold text-blue-600">{area.tagline}</p>
                <p className="mt-3 text-[15px] leading-relaxed text-navy-800/65">{area.copy}</p>

                <ul className="mt-6 space-y-2.5 border-t border-ice-100 pt-6">
                  {area.ready.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14.5px] font-medium text-navy-800">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal-400/15 text-signal-500">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {f}
                    </li>
                  ))}
                  {area.planned.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-[14.5px] font-medium text-navy-800/75">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-600/10 text-blue-500">
                        <Clock3 className="h-3 w-3" strokeWidth={2.5} />
                      </span>
                      {f}
                      <span className="ml-auto shrink-0 rounded-full border border-blue-300 bg-blue-600/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-blue-700 uppercase">
                        Planned
                      </span>
                    </li>
                  ))}
                </ul>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>

        <FadeContent delay={0.2} duration={0.8}>
          <p className="mx-auto mt-8 max-w-xl text-center text-[13.5px] text-navy-800/55">
            Capabilities marked <span className="font-bold text-blue-700">Planned</span> are on the roadmap.
            Optional wallet connection counts, traffic confidence scores, and tracking health checks are also planned.
          </p>
        </FadeContent>
      </div>
    </section>
  );
}
