import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { DocsBody, DocsDescription, DocsPage, DocsTitle } from 'fumadocs-ui/layouts/docs/page';
import { source } from '@/lib/source';
import { getMDXComponents } from '@/mdx-components';
type Props = { params: Promise<{ slug?: string[] }> };
export default async function Page({ params }: Props) {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  const MDX = page.data.body;
  return (
    <DocsPage toc={page.data.toc} breadcrumb={{ enabled: false }} className="reading-page">
      <DocsTitle className="reading-title">{page.data.title}</DocsTitle>
      <DocsDescription className="reading-description">{page.data.description}</DocsDescription>
      <DocsBody className="reading-body"><MDX components={getMDXComponents()} /></DocsBody>
    </DocsPage>
  );
}
export function generateStaticParams() { return source.generateParams(); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = source.getPage((await params).slug);
  if (!page) notFound();
  return {
    title: page.data.title,
    description: page.data.description,
    alternates: { canonical: page.url },
  };
}
