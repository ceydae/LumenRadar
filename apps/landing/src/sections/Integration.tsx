import { Code2, Compass, PackagePlus } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import FadeContent from '../components/FadeContent';
import StatusBadge from '../components/StatusBadge';
import { links } from '../lib/links';

const steps = [
  {
    icon: PackagePlus,
    title: 'Register your project',
    copy: 'Sign in with Discord and register your website. Your project and its dashboard are private to your account.',
  },
  {
    icon: Code2,
    title: 'Add the tracking script',
    copy: 'Set up website analytics, then copy your project’s script from the dashboard into your website’s shared layout.',
  },
  {
    icon: Compass,
    title: 'Check website activity',
    copy: 'Publish your site, visit a page, and refresh your dashboard to see recorded page views. Filter by the last 7 days, 30 days, or all time.',
  },
];

const scriptSnippet = `<!-- Copy your project's full script from the dashboard -->
<script
  defer
  src="https://YOUR_TRACKING_HOST/script.js"
  data-website-id="YOUR_WEBSITE_ID"
></script>`;

function CodeCard({ title, badge, code }: { title: string; badge: string; code: string }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-xl border border-white/10 bg-navy-900/80">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
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
          <SectionHeading
            dark
            eyebrow="Integration"
            title="From zero to signal in three steps."
            copy="Start with website analytics through your Discord account. Register your project, install its script, and check your first page views."
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
            <div className="min-w-0">
              <CodeCard title="Website · tracking script" badge="Available now" code={scriptSnippet} />
              <p className="mt-3 text-[12.5px] leading-relaxed text-blue-200/70">
                Your dashboard supplies the tracking host and website ID. <a href={`${links.docs}/website-tracking/installation`} className="font-semibold text-signal-400 underline underline-offset-4">Read the installation guide</a>.
              </p>
            </div>
            <div className="rounded-xl border border-white/10 bg-navy-900/80 p-6">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-[14px] font-bold text-blue-200">API · OpenTelemetry</h3>
                <StatusBadge tone="planned-dark">Planned</StatusBadge>
              </div>
              <p className="mt-4 text-[14px] leading-relaxed text-blue-200/80">
                Add Lumen Radar as a second destination in your OpenTelemetry setup. The planned integration will retain request counts, error rates, and p50/p95 response times, grouped by endpoint.
              </p>
              <p className="mt-3 text-[13px] leading-relaxed text-blue-200/70">
                Dynamic paths will share one route, so requests to different account IDs count toward the same endpoint.
              </p>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
