import type { Metadata } from "next";
import Onboarding from "@/containers/Onboarding";

export const metadata: Metadata = {
  title: "Set up your project · Lumen Radar",
};
export default function OnboardingPage() {
  return <Onboarding />;
}
