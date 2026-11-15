"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/containers/Sidebar";
import Header from "@/containers/Header";
import Overview from "@/containers/Overview";
import ConnectionDialog from "@/components/ConnectionDialog";
import type { DateRange } from "@/types/analytics";
import { useLocalSession } from "@/hooks/useLocalSession";
import { signOut } from "@/lib/session";
import SessionLoading from "@/components/SessionLoading";
import { useWorkspace } from "@/hooks/useWorkspace";
import { toAnalyticsProject } from "@/utils/project";

export default function Dashboard() {
  const router = useRouter();
  const { session, status } = useLocalSession();
  const { workspace, loaded } = useWorkspace(session?.email);
  const [range, setRange] = useState<DateRange>("30d");
  const [collapsed, setCollapsed] = useState(false);
  const [connectionsOpen, setConnectionsOpen] = useState(false);
  const localProject = workspace?.project;
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
    else if (
      status === "authenticated" &&
      loaded &&
      !localProject?.connectionMode
    )
      router.replace("/onboarding");
  }, [status, loaded, localProject?.connectionMode, router]);
  if (!session || !loaded || !localProject?.connectionMode)
    return <SessionLoading />;
  const project = toAnalyticsProject(localProject);

  function handleSignOut() {
    signOut();
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
        <Header
          projects={[project]}
          project={project}
          range={range}
          onRangeChange={setRange}
        />
        <Overview
          project={project}
          range={range}
          onInspect={() => setConnectionsOpen(true)}
        />
      </div>
      <ConnectionDialog
        open={connectionsOpen}
        onOpenChange={setConnectionsOpen}
        project={project}
      />
    </div>
  );
}
