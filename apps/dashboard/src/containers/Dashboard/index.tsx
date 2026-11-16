"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
import type { DateRange } from "@/types/analytics";
import WebAnalytics from "@/containers/WebAnalytics";
import { useSession } from "@/hooks/useSession";
import { signOut } from "@/lib/session";
import SessionLoading from "@/components/SessionLoading";
import { useProject, useWorkspace } from "@/hooks/useWorkspace";
import { toAnalyticsProject } from "@/utils/project";
import ProjectLoadError from "@/components/ProjectLoadError";
import WebsiteInstallation from "@/containers/WebsiteInstallation";
import InstallationGuide, {
  InstallationBanner,
} from "@/components/InstallationGuide";
import DashboardSkeleton from "@/containers/DashboardSkeleton";
import DashboardFrame from "@/containers/DashboardFrame";

export default function Dashboard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const { session, status } = useSession();
  const { workspace, loaded, error, retry } = useWorkspace(session?.id);
  const detail = useProject(session?.id, projectId, loaded && !error);
  const [range, setRange] = useState<DateRange>("all");
  const [signOutError, setSignOutError] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const localProject = workspace.projects.find((item) => item.id === projectId);
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (
      status === "authenticated" &&
      loaded &&
      localProject &&
      !localProject.connectionMode
    )
      router.replace(`/projects/${projectId}/setup`);
  }, [status, loaded, localProject, projectId, router]);
  if (!session) return <SessionLoading />;
  const sidebar = (
    <Sidebar
      project={localProject ? toAnalyticsProject(localProject) : undefined}
      projects={workspace.projects
        .filter((item) => item.connectionMode)
        .map(toAnalyticsProject)}
      onProjectChange={(id) => router.push(`/projects/${id}`)}
      collapsed={collapsed}
      onToggle={() => setCollapsed((value) => !value)}
    />
  );
  const header = (
    <Header
      name={session.name}
      email={session.email}
      onSignOut={handleSignOut}
    />
  );
  if (!loaded) return <DashboardSkeleton sidebar={sidebar} header={header} />;
  if (error)
    return <ProjectLoadError error={error} onRetry={() => void retry()} />;
  if (detail.error)
    return <ProjectLoadError error={detail.error} onRetry={detail.retry} />;
  if (!detail.loaded)
    return <DashboardSkeleton sidebar={sidebar} header={header} />;
  if (!localProject)
    return (
      <ProjectLoadError error="This project doesn’t exist or isn’t available to your account." />
    );
  if (!localProject.connectionMode) return <SessionLoading />;
  const project = toAnalyticsProject(localProject);

  async function handleSignOut() {
    setSignOutError("");
    try {
      await signOut();
    } catch {
      setSignOutError(
        "Couldn't sign out. Check your connection and try again.",
      );
    }
  }
  return (
    <DashboardFrame header={header} sidebar={sidebar}>
      {signOutError && (
        <p className="form-error" role="alert">
          {signOutError}
        </p>
      )}
      <main id="main-content" className="project-installation-page">
        <InstallationBanner
          domain={project.domain}
          websiteUrl={localProject.websiteUrl}
        />
        <WebAnalytics
          key={`${session.id}:${project.id}`}
          accountId={session.id}
          project={localProject}
          range={range}
          onRangeChange={setRange}
        />
        <div className="project-setup-grid">
          <WebsiteInstallation
            key={project.id}
            project={localProject}
            accountId={session.id}
            onDeleted={() => router.replace("/")}
          />
          <InstallationGuide />
        </div>
      </main>
    </DashboardFrame>
  );
}
