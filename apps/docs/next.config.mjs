import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1'],
  redirects() {
    const movedPages = [
      ['/project-overview', '/projects'],
      ['/data-sources', '/website-tracking'],
      ['/website-tracking/metrics', '/understanding-your-analytics'],
      ['/umami/:path*', '/website-tracking'],
    ];
    return [
      ...movedPages.flatMap(([source, destination]) => [
        { source, destination, permanent: true },
        { source: `/docs${source}`, destination, permanent: true },
      ]),
      { source: '/docs', destination: '/', permanent: true },
      { source: '/docs/:path*', destination: '/:path*', permanent: true },
    ];
  },
};
export default withMDX(nextConfig);
