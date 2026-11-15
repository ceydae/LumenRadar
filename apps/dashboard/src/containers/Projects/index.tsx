"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import AccountHeader from "@/components/AccountHeader";
import ProjectCard from "@/components/ProjectCard";
import ProjectLoadError from "@/components/ProjectLoadError";
import SessionLoading from "@/components/SessionLoading";
import { useSession } from "@/hooks/useSession";
import { useWorkspace } from "@/hooks/useWorkspace";
import { MAX_PROJECTS } from "@/lib/workspace";

export default function Projects() {
  const router = useRouter();
  const { session, status } = useSession();
  const { workspace, loaded, error, retry } = useWorkspace(session?.id);
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);
  if (!session || !loaded) return <SessionLoading />;
  const atLimit = workspace.projects.length >= MAX_PROJECTS;
  return (
    <div className="projects-page">
      <AccountHeader name={session.name} />
      {error ? <ProjectLoadError error={error} onRetry={() => void retry()} /> : (
        <main className="projects-main">
          <div className="projects-heading">
            <div><h1>Your projects</h1><p>Choose a project or create a new one to get started.</p></div>
            <span className="project-count">{workspace.projects.length} / {MAX_PROJECTS} projects</span>
          </div>
          <div className="project-grid">
            {workspace.projects.map((project) => <ProjectCard key={project.id} project={project} />)}
            {atLimit ? (
              <button type="button" className="project-card create-project-card" disabled>
                <Plus size={27} aria-hidden="true" /><strong>Create Project</strong><span>5-project limit reached</span>
              </button>
            ) : (
              <Link className="project-card create-project-card" href="/projects/new">
                <Plus size={27} aria-hidden="true" /><strong>Create Project</strong><span>Set up website analytics</span>
              </Link>
            )}
          </div>
          {atLimit && <p className="projects-limit">You’ve reached the limit of five projects for your account.</p>}
        </main>
      )}
    </div>
  );
}
