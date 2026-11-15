import type { ReactNode } from 'react';

type Tone = 'sample' | 'planned' | 'planned-dark' | 'dev' | 'live';

const tones: Record<Tone, string> = {
  sample: 'border-amber-flag/50 bg-amber-flag/15 text-[#8a5d0b]',
  planned: 'border-blue-300 bg-blue-600/10 text-blue-700',
  'planned-dark': 'border-blue-300/40 bg-blue-300/10 text-blue-200',
  dev: 'border-signal-400/50 bg-signal-400/10 text-signal-500',
  live: 'border-signal-400/60 bg-signal-400/15 text-signal-500',
};

const dots: Record<Tone, string> = {
  sample: 'bg-amber-flag',
  planned: 'bg-blue-500',
  'planned-dark': 'bg-blue-300',
  dev: 'bg-signal-400',
  live: 'bg-signal-400',
};

export default function StatusBadge({ tone, children }: { tone: Tone; children: ReactNode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.08em] uppercase ${tones[tone]}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dots[tone]}`} />
      {children}
    </span>
  );
}
