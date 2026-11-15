"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useTheme } from "@/components/theme-provider";

/* ------------------------------------------------------------------ */
/*  Navbar                                                             */
/* ------------------------------------------------------------------ */

function Navbar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Read env defaults — static so they're available at build time
  const landingHref = process.env.NEXT_PUBLIC_LANDING_URL ?? "http://127.0.0.1:3050";
  const dashboardHref = process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "http://127.0.0.1:3051";

  function toggleTheme() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <>
      <nav className="docs-nav">
        {/* Brand */}
        <a href="/docs" className="docs-nav-brand">
          {/* Symbol — SVG inline so theme colors apply via currentColor */}
          <svg
            width="26"
            height="30"
            viewBox="0 0 26 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13 13-5.82 13-13S20.18 0 13 0zm0 22.5c-5.25 0-9.5-4.25-9.5-9.5S7.75 3.5 13 3.5s9.5 4.25 9.5 9.5-4.25 9.5-9.5 9.5z"
              fill="currentColor"
              opacity="0.9"
            />
            <circle cx="13" cy="13" r="4" fill="currentColor" />
          </svg>
          <span>LumenRadar Docs</span>
        </a>

        {/* Desktop links */}
        <div className="docs-nav-links">
          <a
            className="docs-nav-link"
            href={landingHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            Landing
          </a>
          <a
            className="docs-nav-link"
            href={dashboardHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="7" height="9" x="3" y="3" rx="1" />
              <rect width="7" height="5" x="14" y="3" rx="1" />
              <rect width="7" height="9" x="14" y="12" rx="1" />
              <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
            Dashboard
          </a>
        </div>

        {/* Actions */}
        <div className="docs-nav-actions">
          {/* Theme toggle — desktop */}
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
            className="docs-nav-link"
            style={{ padding: "6px 8px" }}
            title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
          >
            {resolvedTheme === "dark" ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2" />
                <path d="M12 20v2" />
                <path d="m4.93 4.93 1.41 1.41" />
                <path d="m17.66 17.66 1.41 1.41" />
                <path d="M2 12h2" />
                <path d="M20 12h2" />
                <path d="m6.34 17.66-1.41 1.41" />
                <path d="m19.07 4.93-1.41 1.41" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
              </svg>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="docs-nav-link"
            style={{ padding: "6px 8px", display: "none" }}
            aria-label="Open navigation menu"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile nav */}
      <div className="docs-mobile-nav" data-open={mobileOpen ? "true" : "false"}>
        <div className="docs-mobile-panel">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Navigation</span>
            <button
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              style={{
                display: "grid",
                placeItems: "center",
                width: 32,
                height: 32,
                border: 0,
                background: "transparent",
                color: "var(--muted)",
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <a
              href={landingHref}
              className="docs-nav-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "12px 14px", fontSize: 14 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              Landing
            </a>
            <a
              href={dashboardHref}
              className="docs-nav-link"
              target="_blank"
              rel="noopener noreferrer"
              style={{ padding: "12px 14px", fontSize: 14 }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 18, height: 18 }}>
                <rect width="7" height="9" x="3" y="3" rx="1" />
                <rect width="7" height="5" x="14" y="3" rx="1" />
                <rect width="7" height="9" x="14" y="12" rx="1" />
                <rect width="7" height="5" x="3" y="16" rx="1" />
              </svg>
              Dashboard
            </a>
          </div>

          {/* Divider */}
          <div style={{
            height: 1,
            background: "var(--border)",
            margin: "16px 0"
          }} />

          {/* Theme toggle in mobile */}
          <button
            onClick={toggleTheme}
            className="docs-nav-link"
            style={{ padding: "12px 14px", fontSize: 14, justifyContent: "flex-start" }}
          >
            {resolvedTheme === "dark" ? (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4" />
                  <path d="M12 2v2" />
                  <path d="M12 20v2" />
                  <path d="m4.93 4.93 1.41 1.41" />
                  <path d="m17.66 17.66 1.41 1.41" />
                  <path d="M2 12h2" />
                  <path d="M20 12h2" />
                  <path d="m6.34 17.66-1.41 1.41" />
                  <path d="m19.07 4.93-1.41 1.41" />
                </svg>
                Light mode
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
                </svg>
                Dark mode
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Sidebar Frame                                                      */
/* ------------------------------------------------------------------ */

function SidebarFrame() {
  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100dvh",
        width: 268,
        paddingTop: 56,
        borderRight: "1px solid var(--border)",
        background: "var(--sidebar)",
        color: "var(--sidebar-foreground)",
        overflowY: "auto",
        zIndex: 30,
      }}
    >
      {/* Brand */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "16px 20px 14px",
        }}
      >
        <svg
          width="22"
          height="25"
          viewBox="0 0 26 30"
          fill="none"
          style={{ flexShrink: 0 }}
          aria-hidden="true"
        >
          <path
            d="M13 0C5.82 0 0 5.82 0 13s5.82 13 13 13 13-5.82 13-13S20.18 0 13 0zm0 22.5c-5.25 0-9.5-4.25-9.5-9.5S7.75 3.5 13 3.5s9.5 4.25 9.5 9.5-4.25 9.5-9.5 9.5z"
            fill="currentColor"
            opacity="0.85"
          />
          <circle cx="13" cy="13" r="4" fill="currentColor" />
        </svg>
        <span
          style={{
            fontSize: 14,
            fontWeight: 600,
            letterSpacing: "-0.02em",
          }}
        >
          Docs
        </span>
      </div>

      {/* Placeholder nav structure — ready for real items */}
      <div style={{ padding: "8px 12px" }}>
        <p
          style={{
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--sidebar-foreground)",
            opacity: 0.45,
            padding: "8px 12px 6px",
            margin: 0,
          }}
        >
          On this page
        </p>
        <p
          style={{
            fontSize: 12,
            padding: "8px 12px",
            margin: 0,
            color: "var(--sidebar-foreground)",
            opacity: 0.5,
            lineHeight: 1.6,
          }}
        >
          Documentation content will appear here. Add{" "}
          <code
            style={{
              fontSize: 11,
              background: "var(--sidebar-accent)",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            .mdx
          </code>{" "}
          files to{" "}
          <code
            style={{
              fontSize: 11,
              background: "var(--sidebar-accent)",
              padding: "2px 6px",
              borderRadius: 4,
              fontFamily: "ui-monospace, monospace",
            }}
          >
            content/docs
          </code>
          .
        </p>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Bottom section */}
      <div
        style={{
          borderTop: "1px solid var(--sidebar-border)",
          padding: "14px 20px",
          fontSize: 10,
          color: "var(--sidebar-foreground)",
          opacity: 0.45,
        }}
      >
        LumenRadar · v0.1
      </div>
    </aside>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty State                                                        */
/* ------------------------------------------------------------------ */

function EmptyState() {
  return (
    <div className="docs-empty-state">
      <div className="docs-empty-state-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      </div>
      <h2>Documentation coming soon</h2>
      <p>
        We&rsquo;re putting together guides, references, and tutorials for
        LumenRadar. Check back later or explore the landing page in the
        meantime.
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Docs Shell                                                         */
/* ------------------------------------------------------------------ */

export default function DocsLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div style={{ minHeight: "100dvh" }}>
      <Navbar />
      <SidebarFrame />
      <main className="docs-main" style={{ marginLeft: 268 }}>
        <div className="docs-content">
          {children}
        </div>
      </main>
    </div>
  );
}
