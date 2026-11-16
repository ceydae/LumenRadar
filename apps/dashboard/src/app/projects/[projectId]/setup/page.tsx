import Onboarding from "@/containers/Onboarding";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Set up project" };

export default async function ProjectSetupPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  return <Onboarding key={projectId} projectId={projectId} />;
}
