import { createMDX } from 'fumadocs-mdx/next';
const withMDX = createMDX();
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['127.0.0.1'],
  redirects() {
    return [
      { source: '/docs', destination: '/', permanent: true },
      { source: '/docs/:path*', destination: '/:path*', permanent: true },
    ];
  },
};
export default withMDX(nextConfig);
