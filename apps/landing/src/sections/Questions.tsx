import type { ComponentType } from 'react';
import SectionHeading from '../components/SectionHeading';
import TextType from '../components/TextType';
import FadeContent from '../components/FadeContent';
import { SourcesPanel, TopContentPanel, TrendPanel } from '../components/panels';

const rows: { question: string; answer: string; Panel: ComponentType }[] = [
  {
    question: 'Where are visitors coming from?',
    answer:
      'See which communities, docs, and campaigns send people your way — from stellar.org referrals to a single blog post that quietly converts.',
    Panel: SourcesPanel,
  },
  {
    question: 'Which parts of the project are used most?',
    answer:
      'Compare your top pages with your most-called endpoints. When documentation traffic and API usage point at the same feature, you know what to invest in next.',
    Panel: TopContentPanel,
  },
  {
    question: 'How is usage changing over time?',
    answer:
      'Follow adoption week over week across both surfaces. Spot the inflection after a release — or the slow decline before it becomes a problem.',
    Panel: TrendPanel,
  },
];

export default function Questions() {
  return (
    <section id="answers" className="relative bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <SectionHeading
          eyebrow="Answers, not just charts"
          title="Ask the questions your team actually has."
          copy="Our reporting roadmap focuses on three practical questions about adoption. These planned views will help teams understand what brings people in and what keeps them coming back."
        />

        <div className="mt-16 space-y-20 sm:space-y-28">
          {rows.map((row, i) => {
            const flip = i % 2 === 1;
            return (
              <div key={row.question} className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
                <FadeContent duration={0.9} className={flip ? 'lg:order-2' : ''}>
                  <div className="flex max-w-lg flex-col gap-4">
                    <span className="text-[12px] font-extrabold tracking-[0.2em] text-signal-500 uppercase">
                      Question {String(i + 1).padStart(2, '0')}
                    </span>
                    <TextType
                      text={[row.question]}
                      as="h3"
                      startOnVisible
                      loop={false}
                      typingSpeed={34}
                      showCursor
                      cursorCharacter="▌"
                      cursorColor="#3fd6c9"
                      className="min-h-[2.4em] font-display text-2xl font-bold tracking-tight text-navy-900 sm:text-[2rem] sm:leading-[1.15]"
                    />
                    <p className="text-[15.5px] leading-relaxed text-navy-800/65">{row.answer}</p>
                  </div>
                </FadeContent>
                <FadeContent duration={0.9} delay={0.15} className={flip ? 'lg:order-1' : ''}>
                  <row.Panel />
                </FadeContent>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
