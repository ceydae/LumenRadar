import { ArrowUpRight, GitBranch, Minimize2, ShieldCheck } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SpotlightCard from '../components/SpotlightCard';
import FadeContent from '../components/FadeContent';

const pillars = [
  {
    icon: Minimize2,
    title: 'Minimal data collection',
    copy: 'We collect the smallest set of events that answers real questions — no invasive fingerprinting, no resale of anything, ever.',
  },
  {
    icon: ShieldCheck,
    title: 'Isolated project access',
    copy: 'Your project’s data is visible only to the people you invite. Access is scoped per project, never pooled across teams.',
  },
  {
    icon: GitBranch,
    title: 'Open-source development',
    copy: 'Lumen Radar is developed in the open. You can read the code, follow the roadmap, and hold us to what we ship.',
  },
];

const operatorAccess = [
  'Aggregated, ecosystem-level metrics — never raw event streams from individual projects.',
  'Anonymized counts that help evaluate program impact, such as adoption trends across funded projects.',
  'Nothing that identifies your users, and no project-level detail without that project’s consent.',
];

export default function Privacy() {
  return (
    <section id="privacy" className="bg-ice-50 py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Privacy & transparency"
          title="Built to collect less — and to show our work."
          copy="Analytics only helps an ecosystem if people trust it. These are the commitments Lumen Radar is designed around."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <FadeContent key={p.title} delay={i * 0.12} duration={0.9}>
              <SpotlightCard
                theme="light"
                spotlightColor="rgba(63, 214, 201, 0.22)"
                className="h-full rounded-2xl border border-ice-200 bg-white p-7 shadow-lift"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-signal-400/12 text-signal-500">
                  <p.icon className="h-5.5 w-5.5" />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold text-navy-900">{p.title}</h3>
                <p className="mt-2 text-[14.5px] leading-relaxed text-navy-800/65">{p.copy}</p>
              </SpotlightCard>
            </FadeContent>
          ))}
        </div>

        <FadeContent delay={0.2} duration={0.9}>
          <div className="mt-8 grid gap-6 overflow-hidden rounded-2xl border border-blue-200 bg-gradient-to-br from-white to-ice-100 p-7 shadow-lift sm:p-9 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <h3 className="font-display text-xl font-bold text-navy-900">What designated SCF operators can access</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-navy-800/65">
                Lumen Radar is developed with support from the Stellar Community Fund. To keep that relationship
                transparent, here is exactly what designated SCF operators will be able to see:
              </p>
              <ul className="mt-4 space-y-2.5">
                {operatorAccess.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[14.5px] leading-relaxed text-navy-800/80">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-signal-400" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex flex-wrap gap-4">
                <a
                  href="/docs/privacy"
                  className="group inline-flex items-center gap-1 text-[14px] font-bold text-blue-600 hover:text-blue-700"
                >
                  Privacy documentation
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
                <a
                  href="/docs/data-access"
                  className="group inline-flex items-center gap-1 text-[14px] font-bold text-blue-600 hover:text-blue-700"
                >
                  Data access policy
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
            <div className="flex flex-col justify-center rounded-xl border border-amber-flag/40 bg-amber-flag/10 p-6">
              <p className="text-[12px] font-extrabold tracking-[0.14em] text-[#8a5d0b] uppercase">A note on claims</p>
              <p className="mt-2 text-[14px] leading-relaxed text-navy-800/75">
                We publish compliance claims and operational guarantees only once they’ve been verified. Until then,
                this page describes what we’re building toward — not certifications we hold.
              </p>
            </div>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
