'use client';
import type { ComponentProps, CSSProperties } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, Menu, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { DocsLayout as FumadocsLayout, type DocsLayoutProps, useDocsLayout } from 'fumadocs-ui/layouts/docs';
import { Container } from 'fumadocs-ui/layouts/docs/slots/container';
import { FullSearchTrigger, SearchTrigger } from 'fumadocs-ui/layouts/shared/slots/search-trigger';
import { dashboardUrl } from '@/lib/links';

function Brand() {
  return (
    <Link href="/" className="docs-brand" aria-label="Lumen Radar Docs introduction">
      <span className="brand-art" aria-hidden="true">
        <Image src="/brand/symbol-navy.svg" alt="" width={25} height={29} className="brand-light" priority />
        <Image src="/brand/symbol-white.svg" alt="" width={25} height={29} className="brand-dark" priority />
        <Image src="/brand/wordmark-navy.svg" alt="" width={146} height={12} className="brand-light brand-wordmark" priority />
        <Image src="/brand/wordmark-white.svg" alt="" width={146} height={12} className="brand-dark brand-wordmark" priority />
      </span>
      <span className="brand-docs">Docs</span>
    </Link>
  );
}
function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  return (
    <button type="button" className="utility-button" aria-label="Toggle color theme" title="Toggle color theme"
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
      <Moon className="brand-light" size={18} aria-hidden="true" />
      <Sun className="brand-dark" size={18} aria-hidden="true" />
    </button>
  );
}
function Header() {
  const { slots } = useDocsLayout();
  return (
    <header className="docs-header">
      <Brand />
      <nav className="header-utilities" aria-label="Header navigation">
        <FullSearchTrigger className="header-search" />
        <SearchTrigger className="utility-button mobile-search" aria-label="Search documentation" />
        <ThemeToggle />
        <a className="dashboard-link" href={dashboardUrl}>Dashboard <ArrowUpRight size={15} aria-hidden="true" /></a>
        <slots.sidebar.trigger className="utility-button mobile-menu" aria-label="Open documentation navigation">
          <Menu size={19} aria-hidden="true" />
        </slots.sidebar.trigger>
      </nav>
    </header>
  );
}
// The public container slot keeps Fumadocs' responsive sidebar behavior.
// The header spans every column; sticky navigation starts below it.
function LayoutContainer(props: ComponentProps<'div'>) {
  return <Container {...props} style={{
    gridTemplate: '"header header header header header" auto "sidebar sidebar toc-popover toc toc" "sidebar sidebar tabs toc toc" "sidebar sidebar main toc toc" 1fr / minmax(0, 1fr) var(--fd-sidebar-col) minmax(0, calc(var(--fd-layout-width) - var(--fd-sidebar-width) - var(--fd-toc-width))) var(--fd-toc-width) minmax(0, 1fr)',
    '--fd-header-height': '64px',
    '--fd-docs-row-1': 'var(--fd-header-height)',
    '--fd-docs-row-2': 'var(--fd-docs-row-1)',
    ...props.style,
  } as CSSProperties} />;
}
const slots: DocsLayoutProps['slots'] = {
  header: Header, container: LayoutContainer, navTitle: () => null,
  searchTrigger: { sm: SearchTrigger, full: () => null },
};
export default function DocsLayout(props: DocsLayoutProps) {
  return (
    <FumadocsLayout {...props} slots={slots} tabs={false} themeSwitch={{ enabled: false }}
      sidebar={{
        collapsible: false, className: 'docs-sidebar',
        banner: <div className="sidebar-heading">Documentation<p>Web &amp; API analytics</p></div>,
        footer: <p className="sidebar-footer">Built for the Stellar ecosystem</p>,
      }} />
  );
}
