"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, Check, Globe2, LogOut } from "lucide-react";
import Brand from "@/components/Brand";
import SessionLoading from "@/components/SessionLoading";
import ProjectForm from "@/containers/ProjectForm";
import ConnectionSetup from "@/containers/ConnectionSetup";
import { useLocalSession } from "@/hooks/useLocalSession";
import { useWorkspace } from "@/hooks/useWorkspace";
import { signOut } from "@/lib/session";

export default function Onboarding() {
  const router = useRouter();
  const { session, status } = useLocalSession();
  const { workspace, loaded } = useWorkspace(session?.email);
  const [editingProject, setEditingProject] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const project = workspace?.project ?? null;
  const step = project && !editingProject ? 2 : 1;
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (status === "authenticated" && loaded && project?.connectionMode)
      router.replace("/");
  }, [status, loaded, project?.connectionMode, router]);
  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);
  if (!session || !loaded || project?.connectionMode) return <SessionLoading />;
  return (
    <div className="setup-page">
      <header className="setup-header">
        <Brand tone="light" />
        <div className="setup-account">
          <span>{workspace?.name || session.email}</span>
          <button
            type="button"
            className="icon-button"
            aria-label="Sign out"
            onClick={signOut}
          >
            <LogOut size={17} aria-hidden="true" />
          </button>
        </div>
      </header>
      <main className="setup-main">
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
                key={project?.id ?? "new"}
                email={session.email}
                project={project}
                onComplete={() => setEditingProject(false)}
              />
            ) : (
              <ConnectionSetup
                email={session.email}
                project={project!}
                onBack={() => setEditingProject(true)}
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
                : "Start with a project. Bring your website and API activity into a shared workspace."}
            </p>
            {project ? (
              <>
                <div className="setup-summary-detail">
                  <span>About the project</span>
                  <p>{project.stellarDescription}</p>
                </div>
                <div className="setup-summary-detail">
                  <span>Next</span>
                  <p>Select website analytics, API analytics, or both.</p>
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
