"use client";
import { useEffect, useState } from "react";
import { Check, Copy, Code2 } from "lucide-react";
import { CopyButton, CopyButtonIcon } from "@animate-ui/react/primitives/buttons/copy";
import { API_URL } from "@/lib/workspace";
import type { LocalProject } from "@/types/workspace";

export default function WebsiteInstallation({ project }: { project: LocalProject }) {
  const [message, setMessage] = useState("");
  const [copyError, setCopyError] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 3000);
    return () => window.clearTimeout(timer);
  }, [copied]);
  const scriptUrl = `${API_URL}/tracker.js`.replaceAll("&", "&amp;").replaceAll('"', "&quot;");
  const snippet = `<script defer src="${scriptUrl}" data-project-id="${project.id}"></script>`;
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setCopyError("");
      setMessage("Script copied to clipboard.");
    } catch {
      const error = "Copy isn't available. Select the code below and copy it manually.";
      setCopied(false);
      setCopyError(error);
      setMessage(error);
    }
  }
  const local = ["localhost", "127.0.0.1"].includes(new URL(API_URL).hostname);
  return (
    <section className="website-installation" aria-labelledby="installation-title">
      <div className="installation-heading">
        <div className="installation-title"><Code2 size={21} aria-hidden="true" /><h2 id="installation-title">Install website analytics</h2></div>
        <CopyButton
          type="button"
          className="secondary-button"
          content={snippet}
          copied={copied}
          hoverScale={1.02}
          tapScale={0.98}
          onClick={(event) => {
            // Keep visible error feedback; the primitive only logs clipboard failures.
            event.preventDefault();
            void copy();
          }}
        >
          <CopyButtonIcon
            className="copy-script-icon"
            aria-hidden="true"
            icon={<Copy size={16} />}
            copiedIcon={<Check size={16} />}
          />
          {copied ? "Copied" : "Copy script"}
        </CopyButton>
      </div>
      <p>Add this script before the closing <code>&lt;/head&gt;</code> tag on <strong>{new URL(project.websiteUrl).hostname}</strong>. Include it on every page you want to measure.</p>
      <pre tabIndex={0} aria-label="Website analytics installation script"><code>{snippet}</code></pre>
      {local && <p className="installation-note">This script uses your local API. Before installing on a live website, configure a publicly accessible HTTPS API address.</p>}
      <p className="sr-only" role="status">{message}</p>
      {copyError && <p className="form-error">{copyError}</p>}
    </section>
  );
}
