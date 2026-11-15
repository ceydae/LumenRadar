import Dashboard from "@/containers/Dashboard";

export default async function ProjectPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <Dashboard key={projectId} projectId={projectId} />;
}
