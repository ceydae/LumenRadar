import GithubIcon from '../components/GithubIcon';

const columns = [
  {
    title: 'Product',
    links: [
      { label: 'Documentation', href: '/docs' },
      { label: 'Demo dashboard', href: '#demo' },
      { label: 'Development status', href: '/status' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'GitHub', href: 'https://github.com/lumen-radar' },
      { label: 'Privacy', href: '/docs/privacy' },
      { label: 'Data access policy', href: '/docs/data-access' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-navy-950">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <img src="/brand/logo-white.svg" alt="Lumen Radar" className="h-7 w-auto" />
            <p className="mt-4 max-w-xs text-[13.5px] leading-relaxed text-blue-200/60">
              Web and API analytics for projects in the Stellar ecosystem. Understand how your project is used.
            </p>
            <a
              href="https://github.com/lumen-radar"
              target="_blank"
              rel="noreferrer"
              aria-label="Lumen Radar on GitHub"
              className="mt-5 inline-flex text-blue-200/60 transition hover:text-white"
            >
              <GithubIcon className="h-5 w-5" />
            </a>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-[11px] font-extrabold tracking-[0.18em] text-blue-200/50 uppercase">{col.title}</p>
              <ul className="mt-4 space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a href={l.href} className="text-[13.5px] font-medium text-blue-200/75 transition hover:text-white">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
          <p className="text-[12.5px] text-blue-200/50">© 2026 Lumen Radar. Built for the Stellar ecosystem.</p>
          <p className="inline-flex items-center gap-2 text-[12.5px] text-blue-200/50">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping-soft rounded-full bg-signal-400" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal-400" />
            </span>
            In active development — demo uses sample data
          </p>
        </div>
      </div>
    </footer>
  );
}
