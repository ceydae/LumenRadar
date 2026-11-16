import { Code2 } from "lucide-react";
import type { LocalProject } from "@/types/workspace";

export default function WebsiteInstallation({ project }: { project: LocalProject }) {
  return (
    <section className="website-installation" aria-labelledby="installation-title">
      <div className="installation-heading">
        <div className="installation-title"><Code2 size={21} aria-hidden="true" /><h2 id="installation-title">Install website analytics</h2></div>
        <span className="badge">Coming Soon</span>
      </div>
      <p>Your project is set up for <strong>{new URL(project.websiteUrl).hostname}</strong>.</p>
      <p>The tracking script is not available yet. Installation instructions will appear here when website tracking is ready.</p>
      <p className="installation-note">No installation is needed yet. This project is not collecting website analytics.</p>
    </section>
  );
}
