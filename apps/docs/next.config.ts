import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Enable standalone output for Docker — produces a minimal server.js
  output: "standalone",
};

export default nextConfig;
