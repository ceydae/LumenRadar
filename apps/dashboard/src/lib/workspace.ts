import { createBrowserStore } from "./browser-store";
import { signIn } from "./session";
import { isValidEmail } from "../constants/auth";
import type {
  ConnectionMode,
  LocalProject,
  LocalWorkspace,
} from "../types/workspace";

const normalizeEmail = (email: string) => email.trim().toLowerCase();
export const workspaceStore = (email: string) =>
  createBrowserStore(`lumen-radar:workspace:${normalizeEmail(email)}`);

export function isWebsiteUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") && !!url.hostname
    );
  } catch {
    return false;
  }
}

export function parseWorkspace(
  raw: string | null | undefined,
  email: string,
): LocalWorkspace | null {
  if (!raw) return null;
  try {
    const workspace = JSON.parse(raw) as LocalWorkspace;
    if (
      !workspace ||
      workspace.version !== 1 ||
      workspace.email !== normalizeEmail(email) ||
      typeof workspace.name !== "string"
    )
      return null;
    const p = workspace.project;
    if (
      p !== null &&
      (!p ||
        typeof p.id !== "string" ||
        typeof p.name !== "string" ||
        !p.name.trim() ||
        typeof p.websiteUrl !== "string" ||
        !isWebsiteUrl(p.websiteUrl) ||
        typeof p.stellarDescription !== "string" ||
        typeof p.serviceName !== "string" ||
        typeof p.createdAt !== "string" ||
        ![null, "web", "api", "both"].includes(p.connectionMode))
    )
      return null;
    return workspace;
  } catch {
    return null;
  }
}

function readWorkspace(email: string) {
  return parseWorkspace(workspaceStore(email).getSnapshot(), email);
}

export function registerAccount(name: string, email: string) {
  email = normalizeEmail(email);
  if (!name.trim() || !isValidEmail(email))
    throw new Error("Enter your name and a valid email address.");
  const store = workspaceStore(email);
  const previous = store.getSnapshot();
  if (parseWorkspace(previous, email))
    throw new Error("An account already uses this email. Sign in to continue.");
  store.write(
    JSON.stringify({
      version: 1,
      email,
      name: name.trim(),
      project: null,
    } satisfies LocalWorkspace),
  );
  try {
    signIn(email);
  } catch (error) {
    store.write(previous);
    throw error;
  }
}

export function saveProject(
  email: string,
  details: Pick<LocalProject, "name" | "websiteUrl" | "stellarDescription">,
) {
  if (
    !details.name.trim() ||
    !details.stellarDescription.trim() ||
    !isWebsiteUrl(details.websiteUrl.trim())
  )
    throw new Error(
      "Enter a project name, an HTTP or HTTPS website URL, and a short description.",
    );
  const workspace = readWorkspace(email) ?? {
    version: 1,
    email: normalizeEmail(email),
    name: email.split("@")[0],
    project: null,
  };
  const previous = workspace.project;
  workspace.project = {
    ...details,
    name: details.name.trim(),
    websiteUrl: new URL(details.websiteUrl.trim()).href,
    stellarDescription: details.stellarDescription.trim(),
    id: previous?.id ?? crypto.randomUUID(),
    createdAt: previous?.createdAt ?? new Date().toISOString(),
    connectionMode: previous?.connectionMode ?? null,
    serviceName: previous?.serviceName ?? "",
  };
  workspaceStore(email).write(JSON.stringify(workspace));
}

export function saveConnection(
  email: string,
  mode: ConnectionMode,
  serviceName: string,
) {
  const workspace = readWorkspace(email);
  if (!workspace?.project) throw new Error("Create your project first.");
  if (!["web", "api", "both"].includes(mode))
    throw new Error("Choose a data source.");
  if (mode !== "web" && !serviceName.trim())
    throw new Error("Enter a service name for your API.");
  workspace.project = {
    ...workspace.project,
    connectionMode: mode,
    serviceName: mode === "web" ? "" : serviceName.trim(),
  };
  workspaceStore(email).write(JSON.stringify(workspace));
}
