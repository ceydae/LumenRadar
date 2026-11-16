import { ArrowUpRight } from 'lucide-react';
import GridScan from '../components/GridScan';
import SplitText from '../components/SplitText';
import BlurText from '../components/BlurText';
import StarBorder from '../components/StarBorder';
import ShinyText from '../components/ShinyText';
import FadeContent from '../components/FadeContent';
import DashboardMock from '../components/DashboardMock';
import { links } from '../lib/links';

export default function Hero() {
  return (
    <section id="top" className="relative overflow-hidden bg-navy-950">
      {/* radar-style animated background */}
      <div className="absolute inset-0 opacity-60" aria-hidden="true">
        <GridScan
          linesColor="#16326b"
          scanColor="#3fd6c9"
          lineThickness={1}
          scanDuration={5.5}
          scanDelay={1.2}
          glow={0.7}
          points
          interactive={false}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_0%,transparent_25%,#04102a_88%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto flex max-w-6xl flex-col items-center px-5 pt-36 pb-20 text-center sm:pt-44">
        {/* eyebrow */}
        <FadeContent duration={0.8} className="flex">
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[12px] font-semibold tracking-wide text-blue-200 backdrop-blur">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-signal-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
            </span>
            Analytics for the Stellar ecosystem
          </span>
        </FadeContent>

        {/* headline */}
        <SplitText
          text="Understand how your Stellar project is used."
          tag="h1"
          splitType="words"
          delay={55}
          duration={0.9}
          trigger="load"
          mask
          className="mt-7 max-w-3xl font-display text-4xl leading-[1.06] font-bold tracking-tight text-balance text-white sm:text-6xl"
        />

        {/* intro */}
        <BlurText
          text="Free, open-source analytics for the Stellar ecosystem. Start tracking website activity in your private dashboard, with API analytics and shared metrics for SCF reviewers on the roadmap."
          animateBy="words"
          delay={14}
          className="mt-6 max-w-2xl justify-center text-base leading-relaxed text-blue-200/85 sm:text-lg"
        />

        {/* actions */}
        <FadeContent delay={0.4} duration={0.9} className="mt-9 flex flex-col items-center gap-5">
          <div className="flex flex-wrap items-center justify-center gap-4">
              <StarBorder
                as="a"
                href={links.dashboard}
                color="#3fd6c9"
                trailColor="#5b85de"
                backgroundColor="#0b2757"
                textColor="#ffffff"
                radius={999}
                thickness={2}
                duration={4}
                glow={0.9}
                className="cursor-pointer"
              >
                <span className="flex items-center gap-2 px-3 py-1 text-[15px] font-bold">
                  Get started
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </StarBorder>
            <a
              href={links.docs}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[14px] font-semibold text-blue-200 transition hover:border-white/35 hover:text-white"
            >
              Read the docs
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </div>
          <ShinyText
            text="Free to use · Sign in with Discord"
            color="#9dbbf5"
            shineColor="#ffffff"
            speed={3.5}
            className="text-[12.5px] font-medium tracking-wide"
          />
        </FadeContent>

        {/* reporting roadmap */}
        <FadeContent delay={0.55} duration={1.1} className="mt-14 w-full max-w-5xl">
          <div className="relative">
            <div
              className="pointer-events-none absolute -inset-x-8 -top-8 h-40 bg-[radial-gradient(50%_100%_at_50%_0%,rgba(63,214,201,0.14),transparent)]"
              aria-hidden="true"
            />
            <DashboardMock />
            <p className="mt-4 text-[12.5px] text-blue-200/60">
              Reporting roadmap · Website setup and pageview counts are available now. Advanced web reports and API analytics are planned.
            </p>
          </div>
        </FadeContent>
      </div>
    </section>
  );
}
