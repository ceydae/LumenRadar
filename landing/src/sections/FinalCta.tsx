import { Play } from 'lucide-react';
import StarBorder from '../components/StarBorder';
import ShinyText from '../components/ShinyText';
import SplitText from '../components/SplitText';
import FadeContent from '../components/FadeContent';

export default function FinalCta() {
  return (
    <section className="bg-white px-5 py-24 sm:py-28">
      <FadeContent duration={1}>
        <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl bg-navy-950 px-6 py-20 text-center shadow-card sm:px-12">
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_50%_-10%,rgba(63,214,201,0.16),transparent_60%)]"
            aria-hidden="true"
          />
          <img
            src="/brand/symbol-white.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-12 h-64 w-64 opacity-[0.07]"
          />
          <div className="relative flex flex-col items-center">
            <SplitText
              text="Put your project on the radar."
              tag="h2"
              splitType="words"
              delay={60}
              duration={0.8}
              mask
              className="max-w-xl font-display text-3xl font-bold tracking-tight text-balance text-white sm:text-5xl"
            />
            <p className="mt-4 max-w-lg text-[15.5px] leading-relaxed text-blue-200/80">
              Take the demo dashboard for a spin and picture your own project’s numbers in it. Web and API usage, one
              clear view, zero guesswork.
            </p>
            <a href="#demo" className="mt-8 inline-block" aria-label="Explore the demo dashboard">
              <StarBorder
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
                  <Play className="h-4 w-4 fill-current" />
                  Explore demo
                </span>
              </StarBorder>
            </a>
            <ShinyText
              text="Sample data · no signup required"
              color="#9dbbf5"
              shineColor="#ffffff"
              speed={3.5}
              className="mt-4 text-[12.5px] font-medium tracking-wide"
            />
          </div>
        </div>
      </FadeContent>
    </section>
  );
}
