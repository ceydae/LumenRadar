import Dashboard from "@/containers/Dashboard";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Project analytics" };

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <Dashboard key={projectId} projectId={projectId} />;
}
