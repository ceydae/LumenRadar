import Projects from "@/containers/Projects";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: { absolute: "Projects · Lumen Radar Dashboard" },
  alternates: { canonical: "/" },
};

export default async function Home({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  if ((await searchParams).error !== undefined) redirect("/login?error=oauth_callback");
  return <Projects />;
}
