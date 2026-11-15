import Projects from "@/containers/Projects";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Projects · Lumen Radar" };

export default function Home() {
  return <Projects />;
}
