import { projectRequest } from './workspace.ts';
import type { DateRange } from '../types/analytics.ts';

export const dateRanges = [
  { value: 'all', label: 'All time' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
] as const;

export function analyticsPath(
  projectId: string,
  range: DateRange,
  now = Date.now(),
) {
  const path = `/${encodeURIComponent(projectId)}/analytics`;
  if (range === 'all') return path;
  const days = range === '7d' ? 7 : 30;
  return `${path}?${new URLSearchParams({ startAt: String(now - days * 86400000), endAt: String(now) })}`;
}

export async function readPageviews(
  projectId: string,
  range: DateRange,
  signal?: AbortSignal,
) {
  const data = await projectRequest(
    analyticsPath(projectId, range),
    undefined,
    'GET',
    signal,
  );
  if (!Number.isSafeInteger(data.pageviews) || data.pageviews < 0)
    throw new Error(
      'Analytics returned an invalid pageview count. Please try again.',
    );
  return data.pageviews as number;
}

export function trackingSnippet(websiteId: string) {
  const publicUrl = process.env.NEXT_PUBLIC_UMAMI_URL?.trim();
  if (!publicUrl)
    throw new Error('NEXT_PUBLIC_UMAMI_URL must be set before building the dashboard.');
  const url = new URL(publicUrl);
  if (
    !['http:', 'https:'].includes(url.protocol) ||
    url.hostname === 'umami' ||
    url.username ||
    url.password ||
    url.search ||
    url.hash
  )
    throw new Error(
      'The public analytics URL must be an HTTP(S) URL without credentials, query parameters, or a fragment.',
    );
  const escape = (value: string) =>
    value
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  return `<script defer src="${escape(url.href.replace(/\/$/, ''))}/script.js" data-website-id="${escape(websiteId)}"></script>`;
}
