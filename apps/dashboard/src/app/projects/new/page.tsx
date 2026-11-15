import type { Metadata } from "next";
import Onboarding from "@/containers/Onboarding";

export const metadata: Metadata = { title: "Create project · Lumen Radar" };
export default function NewProjectPage() { return <Onboarding />; }
