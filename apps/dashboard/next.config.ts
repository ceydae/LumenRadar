import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  allowedDevOrigins: ["dashboard.lumenradar.org"],
};

export default nextConfig;
