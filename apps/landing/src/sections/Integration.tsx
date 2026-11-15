import { Code2, Compass, PackagePlus } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import FadeContent from '../components/FadeContent';
import StatusBadge from '../components/StatusBadge';

const steps = [
  {
    icon: PackagePlus,
    title: 'Register your project',
    copy: 'Create a project in Lumen Radar, name it, and receive the credentials that tie incoming data to your workspace.',
  },
  {
    icon: Code2,
    title: 'Connect your data sources',
    copy: 'Add the versioned tracking script to your website, and point your API’s OpenTelemetry exporter at Lumen Radar. Both are opt-in and removable.',
  },
  {
    icon: Compass,
    title: 'Explore your reports',
    copy: 'Open the dashboard and watch web and API activity arrive in one view — ready for the questions your team already asks.',
  },
];

const scriptSnippet = `<!-- Website: versioned tracking script -->
<script
  src="https://radar.lumenradar.io/v1/lumen.min.js"
  data-project="stellar-demo"
  defer
><\/script>`;

const otelSnippet = `# API: OpenTelemetry collector
exporters:
  otlphttp/lumenradar:
    endpoint: https://ingest.lumenradar.io/otlp
    headers:
      x-lumen-project: \${LUMEN_PROJECT_KEY}`;

function CodeCard({ title, badge, code }: { title: string; badge: string; code: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-navy-900/80">
      <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <p className="text-[12px] font-bold text-blue-200">{title}</p>
        <span className="rounded-full border border-amber-flag/40 bg-amber-flag/10 px-2 py-0.5 text-[10px] font-bold tracking-wider text-amber-flag uppercase">
          {badge}
        </span>
      </div>
      <pre className="overflow-x-auto p-4 text-[12.5px] leading-relaxed text-blue-200/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function Integration() {
  return (
    <section id="integration" className="relative overflow-hidden bg-navy-950 py-24 sm:py-32">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(36,74,151,0.35),transparent_70%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-6xl px-5">
        <div className="flex flex-col items-center gap-4">
          <StatusBadge tone="planned-dark">Planned setup process</StatusBadge>
          <SectionHeading
            dark
            eyebrow="Integration"
            title="From zero to signal in three steps."
            copy="This is the setup flow we're building toward. It isn't operational yet — the snippets below show the intended shape, not a working release."
          />
        </div>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div
            className="absolute top-8 right-[16%] left-[16%] hidden h-px bg-gradient-to-r from-transparent via-signal-400/40 to-transparent md:block"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <FadeContent key={step.title} delay={i * 0.15} duration={0.9}>
              <div className="relative flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur">
                <div className="flex items-center gap-3">
                  <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-signal-400/30 bg-navy-900 text-signal-400">
                    <step.icon className="h-7 w-7" />
                  </span>
                  <span className="text-[40px] leading-none font-extrabold text-white/10 tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-blue-200/70">{step.copy}</p>
              </div>
            </FadeContent>
          ))}
        </div>

        <FadeContent delay={0.2} duration={0.9}>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            <CodeCard title="Website · tracking script" badge="Planned" code={scriptSnippet} />
            <CodeCard title="API · OpenTelemetry" badge="Planned" code={otelSnippet} />
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
