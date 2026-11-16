import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Set up your project · Lumen Radar",
};
export default function OnboardingPage() {
  redirect("/projects/new");
}
