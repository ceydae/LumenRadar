import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Crawlers must be able to read the noindex metadata on dashboard pages.
  return { rules: { userAgent: "*", allow: "/" } };
}
