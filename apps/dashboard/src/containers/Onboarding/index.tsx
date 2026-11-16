"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowUpRight, Check, Globe2 } from "lucide-react";
import Link from "next/link";
import AccountHeader from "@/components/AccountHeader";
import ProjectLoadError from "@/components/ProjectLoadError";
import SessionLoading from "@/components/SessionLoading";
import ProjectForm from "@/containers/ProjectForm";
import ConnectionSetup from "@/containers/ConnectionSetup";
import { useSession } from "@/hooks/useSession";
import { useWorkspace } from "@/hooks/useWorkspace";
import { MAX_PROJECTS, type ProjectDetails } from "@/lib/workspace";

export default function Onboarding({ projectId }: { projectId?: string }) {
  const router = useRouter();
  const { session, status } = useSession();
  const { workspace, loaded, error, retry } = useWorkspace(session?.id);
  const [editingProject, setEditingProject] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const existingProject = workspace.projects.find((item) => item.id === projectId) ?? null;
  const [draft, setDraft] = useState<ProjectDetails | null>(null);
  const project = draft ?? existingProject;
  const step = project && !editingProject ? 2 : 1;
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (status === "authenticated" && loaded && existingProject?.connectionMode)
      router.replace(`/projects/${projectId}`);
  }, [status, loaded, existingProject?.connectionMode, projectId, router]);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);
  if (!session || !loaded || existingProject?.connectionMode) return <SessionLoading />;
  if (error) return <ProjectLoadError error={error} onRetry={() => void retry()} />;
  if (projectId && !project) return <ProjectLoadError error="This project doesn’t exist or isn’t available to your account." />;
  if (!projectId && workspace.projects.length >= MAX_PROJECTS) return <ProjectLoadError title="Project limit reached." error="You’ve reached the limit of five projects for your account." />;
  return (
    <div className="setup-page">
      <AccountHeader name={session.name} />
      <main className="setup-main">
        <Link className="back-button projects-back" href="/"><ArrowLeft size={15} aria-hidden="true" /> All projects</Link>
        <nav aria-label="Setup progress">
          <ol className="setup-progress">
            {["Project details", "Data sources"].map((label, index) => (
              <li
                key={label}
                aria-current={step === index + 1 ? "step" : undefined}
                data-complete={step > index + 1}
              >
                <span className="step-number">
                  {step > index + 1 ? (
                    <Check size={14} aria-hidden="true" />
                  ) : (
                    index + 1
                  )}
                </span>
                <span>{label}</span>
              </li>
            ))}
          </ol>
        </nav>
        <div className="setup-layout">
          <section className="setup-content">
            <div className="setup-heading">
              <h1 ref={headingRef} tabIndex={-1}>
                {step === 1
                  ? "Tell us about your project."
                  : "What would you like to measure?"}
              </h1>
              <p>
                {step === 1
                  ? "Give your project a home in Lumen Radar."
                  : "Choose the data sources for your project’s workspace."}
              </p>
            </div>
            {step === 1 ? (
              <ProjectForm
                key={existingProject?.id ?? "new"}
                project={project}
                onComplete={(details) => {
                  setDraft(details);
                  setEditingProject(false);
                }}
              />
            ) : (
              <ConnectionSetup
                accountId={session.id}
                project={project!}
                onBack={() => setEditingProject(true)}
                onComplete={(saved) => router.push(`/projects/${saved.id}`)}
              />
            )}
          </section>
          <aside className="setup-summary">
            <span className="setup-summary-symbol">
              <Globe2 size={22} aria-hidden="true" />
            </span>
            <h2>{project?.name ?? "Your project, in one place."}</h2>
            <p>
              {project
                ? new URL(project.websiteUrl).hostname
                : "Start with a project. Understand how people use your website."}
            </p>
            {project ? (
              <>
                <div className="setup-summary-detail">
                  <span>About the project</span>
                  <p>{project.stellarDescription}</p>
                </div>
                <div className="setup-summary-detail">
                  <span>Next</span>
                  <p>Create your website project. Tracking installation is coming soon.</p>
                </div>
              </>
            ) : (
              <div className="setup-summary-detail">
                <span>What you’ll need</span>
                <ul>
                  <li>A project name</li>
                  <li>Your website or project URL</li>
                  <li>A brief description of your Stellar integration</li>
                </ul>
              </div>
            )}
            <div className="setup-summary-footer">
              Built for the Stellar ecosystem
              <ArrowUpRight size={14} aria-hidden="true" />
            </div>
          </aside>
        </div>
      </main>
      <footer className="setup-footer">
        Lumen Radar · Web & API analytics
      </footer>
    </div>
  );
}
