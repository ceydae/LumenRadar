import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { RootProvider } from 'fumadocs-ui/provider/next';
import './globals.css';
export const metadata: Metadata = {
  metadataBase: new URL('https://docs.lumenradar.com'),
  title: { default: 'Lumen Radar Docs', template: '%s - Lumen Radar Docs' },
  applicationName: 'Lumen Radar Docs',
  description: 'Learn your way around Lumen Radar, web and API analytics for Stellar projects.',
  icons: {
    icon: [{ url: '/favicon.svg', type: 'image/svg+xml' }, { url: '/favicon.ico', sizes: 'any' }],
    apple: '/apple-touch-icon.png',
  },
};
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <RootProvider theme={{ defaultTheme: 'system', storageKey: 'lumen-radar-docs-theme' }}>
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
