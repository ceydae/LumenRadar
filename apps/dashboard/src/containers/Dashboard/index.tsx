"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
// MVP: restore these imports with the analytics sections below when reports are ready.
// import Overview from "@/containers/Overview";
// import ConnectionDialog from "@/components/ConnectionDialog";
// import type { DateRange } from "@/types/analytics";
import { useSession } from "@/hooks/useSession";
import { signOut } from "@/lib/session";
import SessionLoading from "@/components/SessionLoading";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toAnalyticsProject } from "@/utils/project";
import ProjectLoadError from "@/components/ProjectLoadError";
import WebsiteInstallation from "@/containers/WebsiteInstallation";
import InstallationGuide, { InstallationBanner } from "@/components/InstallationGuide";

export default function Dashboard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { session, status } = useSession();
  const { workspace, loaded, error, retry } = useWorkspace(session?.id);
  // const [range, setRange] = useState<DateRange>("30d");
  // const [connectionsOpen, setConnectionsOpen] = useState(false);
  const [signOutError, setSignOutError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const localProject = workspace.projects.find((item) => item.id === projectId);
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (
      status === "authenticated" &&
      loaded &&
      localProject && !localProject.connectionMode
    )
      router.replace(`/projects/${projectId}/setup`);
  }, [status, loaded, localProject, projectId, router]);
  if (!session || !loaded)
    return <SessionLoading />;
  if (error) return <ProjectLoadError error={error} onRetry={() => void retry()} />;
  if (!localProject) return <ProjectLoadError error="This project doesn’t exist or isn’t available to your account." />;
  if (!localProject.connectionMode) return <SessionLoading />;
  const project = toAnalyticsProject(localProject);

  async function handleSignOut() {
    setSignOutError("");
    try { await signOut(); }
    catch { setSignOutError("Couldn't sign out. Check your connection and try again."); }
  }
  return (
    <div className="dashboard">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Sidebar
        email={session.email}
        onSignOut={handleSignOut}
        collapsed={collapsed}
        onToggle={() => setCollapsed((value) => !value)}
      />
      <div className="dashboard-body">
        {signOutError && <p className="form-error" role="alert">{signOutError}</p>}
        <Header
          projects={workspace.projects.filter((item) => item.connectionMode).map(toAnalyticsProject)}
          project={project}
          websiteUrl={localProject.websiteUrl}
          onProjectChange={(id) => router.push(`/projects/${id}`)}
        />
        <main id="main-content" className="project-installation-page">
          <InstallationBanner domain={project.domain} />
          <WebsiteInstallation key={project.id} project={localProject} />
          <InstallationGuide />
        </main>
        {/* MVP: keep the analytics overview available for the reporting release.
        <Overview
          project={project}
          range={range}
          onInspect={() => setConnectionsOpen(true)}
        />
        */}
      </div>
      {/* MVP: restore connection details alongside analytics reporting.
      <ConnectionDialog
        open={connectionsOpen}
        onOpenChange={setConnectionsOpen}
        project={project}
      />
      */}
    </div>
  );
}
