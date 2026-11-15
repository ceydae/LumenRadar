import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import GithubIcon from '../components/GithubIcon';

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Questions', href: '#answers' },
  { label: 'Integration', href: '#integration' },
  { label: 'Privacy', href: '#privacy' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-white/10 bg-navy-950/85 backdrop-blur-xl' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-5">
        <a href="#top" className="flex h-11 shrink-0 items-center">
          <img src="/brand/logo-header-white.svg" alt="Lumen Radar" width="1805" height="351" className="block h-5 w-auto min-[360px]:h-7 min-[400px]:h-8 sm:h-9" />
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[13.5px] font-medium text-blue-200/70 transition hover:text-white">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="https://github.com/lumen-radar"
            target="_blank"
            rel="noreferrer"
            aria-label="Lumen Radar on GitHub"
            className="hidden text-blue-200/70 transition hover:text-white sm:block"
          >
            <GithubIcon className="h-5 w-5" />
          </a>
          <a
            href="#demo"
            className="group inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-signal-400 px-3 py-2 sm:px-4 text-[13px] font-bold text-navy-950 transition hover:bg-signal-500 hover:text-navy-950"
          >
            Explore demo
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}
