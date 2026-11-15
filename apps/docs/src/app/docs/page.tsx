import DocsLayout from "@/components/docs-layout";

export default function DocsPage() {
  return (
    <DocsLayout>
      <EmptyDocs />
    </DocsLayout>
  );
}

function EmptyDocs() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        gap: 14,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      <div
        style={{
          display: "grid",
          placeItems: "center",
          width: 56,
          height: 56,
          borderRadius: 16,
          background: "var(--accent)",
          color: "var(--color-blue-600)",
          marginBottom: 8,
        }}
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" x2="8" y1="13" y2="13" />
          <line x1="16" x2="8" y1="17" y2="17" />
          <line x1="10" x2="8" y1="9" y2="9" />
        </svg>
      </div>

      <h2
        style={{
          fontSize: 18,
          fontWeight: 650,
          letterSpacing: "-0.02em",
          margin: 0,
        }}
      >
        Documentation coming soon
      </h2>
      <p
        style={{
          color: "var(--muted)",
          fontSize: 13,
          lineHeight: 1.7,
          margin: 0,
        }}
      >
        We&rsquo;re putting together guides, references, and tutorials for
        LumenRadar. Check back later.
      </p>
    </div>
  );
}
