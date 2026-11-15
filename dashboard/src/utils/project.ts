import type { Project } from "@/types/analytics";
import type { LocalProject } from "@/types/workspace";

export function getSourceStatus(connected: boolean, configured: boolean) {
  return connected
    ? "Connected"
    : configured
      ? "Awaiting data"
      : "Not selected";
}

export function toAnalyticsProject(project: LocalProject): Project {
  return {
    id: project.id,
    name: project.name,
    domain: new URL(project.websiteUrl).hostname,
    initials: project.name
      .split(/\s+/)
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    webConfigured:
      project.connectionMode === "web" || project.connectionMode === "both",
    apiConfigured:
      project.connectionMode === "api" || project.connectionMode === "both",
    webConnected: false,
    apiConnected: false,
    serviceName: project.serviceName,
    traffic: [],
    pages: [],
    sources: [],
  };
}
