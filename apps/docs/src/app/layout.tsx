import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/plus-jakarta-sans";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "LumenRadar Docs",
    template: "%s · LumenRadar Docs",
  },
  description: "Documentation for LumenRadar — web and API analytics for the Stellar ecosystem.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
