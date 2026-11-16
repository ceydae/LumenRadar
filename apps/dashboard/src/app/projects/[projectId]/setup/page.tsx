import Onboarding from "@/containers/Onboarding";

export default async function ProjectSetupPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <Onboarding key={projectId} projectId={projectId} />;
}
