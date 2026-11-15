import BlurText from './BlurText';

export default function SectionHeading({
  eyebrow,
  title,
  copy,
  dark = false,
  align = 'center',
}: {
  eyebrow: string;
  title: string;
  copy?: string;
  dark?: boolean;
  align?: 'center' | 'left';
}) {
  const alignCls = align === 'center' ? 'items-center text-center mx-auto' : 'items-start text-left';
  return (
    <div className={`flex max-w-2xl flex-col gap-4 ${alignCls}`}>
      <span
        className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-bold tracking-[0.14em] uppercase ${
          dark ? 'border-white/15 bg-white/5 text-signal-400' : 'border-blue-200 bg-white text-blue-600'
        }`}
      >
        {eyebrow}
      </span>
      <BlurText
        text={title}
        animateBy="words"
        delay={60}
        className={`font-display text-3xl font-bold tracking-tight text-balance sm:text-4xl ${dark ? 'text-white' : 'text-navy-800'}`}
      />
      {copy ? <p className={`text-base leading-relaxed sm:text-lg ${dark ? 'text-blue-200/80' : 'text-navy-800/65'}`}>{copy}</p> : null}
    </div>
  );
}
