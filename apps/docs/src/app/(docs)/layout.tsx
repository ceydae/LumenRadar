import type { ReactNode } from 'react';
import DocsLayout from '@/components/docs-layout';
import { source } from '@/lib/source';
export default function Layout({ children }: { children: ReactNode }) {
  return <DocsLayout tree={source.getPageTree()}>{children}</DocsLayout>;
}
