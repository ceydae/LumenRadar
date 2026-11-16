import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/plus-jakarta-sans";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  metadataBase: new URL("https://dashboard.lumenradar.org"),
  title: {
    default: "Lumen Radar Dashboard — Your project. Your analytics.",
    template: "%s · Lumen Radar Dashboard",
  },
  description: "Sign in with Discord to manage your Stellar projects, install website tracking, and view page activity in your private Lumen Radar dashboard.",
  applicationName: "Lumen Radar Dashboard",
  authors: [{ name: "Lumen Radar", url: "https://lumenradar.org" }],
  referrer: "strict-origin-when-cross-origin",
  icons: { icon: "/favicon.ico", apple: "/apple-touch-icon.png" },
  robots: { index: false, follow: false, noarchive: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Lumen Radar Dashboard",
    title: "Lumen Radar Dashboard — Your project. Your analytics.",
    description: "Sign in with Discord. Manage your Stellar projects and track website activity in your private dashboard.",
    // Share the workspace entry point without exposing a private project's URL or name.
    url: "https://dashboard.lumenradar.org/",
    images: [{
      url: "/og-dashboard.png",
      secureUrl: "https://dashboard.lumenradar.org/og-dashboard.png",
      type: "image/png",
      width: 1200,
      height: 630,
      alt: "Lumen Radar Dashboard — Your project. Your analytics. Sign in with Discord. dashboard.lumenradar.org",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumen Radar Dashboard — Your project. Your analytics.",
    description: "Sign in with Discord. Manage your Stellar projects and track website activity in your private dashboard.",
    images: [{
      url: "/og-dashboard.png",
      alt: "Lumen Radar Dashboard — Your project. Your analytics. dashboard.lumenradar.org",
    }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#04102a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
