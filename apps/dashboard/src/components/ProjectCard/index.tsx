import Link from "next/link";
import { ArrowUpRight, Globe2 } from "lucide-react";
import type { LocalProject } from "@/types/workspace";

export default function ProjectCard({ project }: { project: LocalProject }) {
  return (
    <Link className="project-card" href={project.connectionMode ? `/projects/${project.id}` : `/projects/${project.id}/setup`}>
      <div className="project-card-top">
        <span className="project-card-icon"><Globe2 size={22} aria-hidden="true" /></span>
        <ArrowUpRight size={17} aria-hidden="true" />
      </div>
      <div>
        <h2>{project.name}</h2>
        <p>{new URL(project.websiteUrl).hostname}</p>
      </div>
      <span className="project-card-status">{project.connectionMode ? "Website analytics" : "Continue setup"}</span>
    </Link>
  );
}
