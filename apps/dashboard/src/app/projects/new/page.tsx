import type { Metadata } from "next";
import Onboarding from "@/containers/Onboarding";

export const metadata: Metadata = {
  title: "Create project",
  alternates: { canonical: "/projects/new" },
};
export default function NewProjectPage() { return <Onboarding />; }
