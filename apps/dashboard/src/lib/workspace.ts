import type { LocalProject } from "../types/workspace";

export const MAX_PROJECTS = 5;
export const MAX_DESCRIPTION_LENGTH = 200;
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3051").replace(/\/$/, "");

export type ProjectDetails = Pick<LocalProject, "name" | "websiteUrl" | "stellarDescription">;
interface ApiProject {
  id: string;
  streamName: string;
  websiteUrl: string;
  description: string;
  mode: "web" | "api" | "both";
  createdAt: string;
  updatedAt: string;
}

function toLocalProject(project: ApiProject): LocalProject {
  return {
    id: project.id,
    name: project.streamName,
    websiteUrl: project.websiteUrl,
    stellarDescription: project.description,
    connectionMode: project.mode,
    serviceName: "",
    createdAt: project.createdAt,
  };
}
type ProjectState = { projects: LocalProject[]; loaded: boolean; error: string };
const initialState: ProjectState = { projects: [], loaded: false, error: "" };
const stores = new Map<string, ReturnType<typeof createProjectStore>>();

async function projectRequest(path = "", body?: object, method = "POST") {
  const response = await fetch(`${API_URL}/api/projects${path}`, {
    method: body ? method : "GET",
    credentials: "include",
    cache: "no-store",
    signal: AbortSignal.timeout(15000),
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Your projects couldn't be loaded. Please try again.");
  return data;
}

function createProjectStore() {
  let state = initialState;
  let loading: Promise<void> | undefined;
  const listeners = new Set<() => void>();
  function update(next: ProjectState) {
    state = next;
    listeners.forEach((listener) => listener());
  }
  return {
    getSnapshot: () => state,
    getServerSnapshot: () => initialState,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    load() {
      if (loading) return loading;
      loading = (async () => {
        try {
          const data: { projects: ApiProject[] } = await projectRequest();
          const projects = data.projects.map(toLocalProject);
          update({ projects, loaded: true, error: "" });
        } catch (error) {
          update({ ...state, loaded: true, error: error instanceof Error ? error.message : "Your projects couldn't be loaded. Please try again." });
        } finally { loading = undefined; }
      })();
      return loading;
    },
    async save(details: ProjectDetails, projectId?: string) {
      if (details.stellarDescription.trim().length > MAX_DESCRIPTION_LENGTH)
        throw new Error("Keep your description to 200 characters or fewer.");
      const data: { project: ApiProject } = await projectRequest(projectId ? `/${projectId}` : "", {
        streamName: details.name.trim(),
        websiteUrl: details.websiteUrl.trim(),
        description: details.stellarDescription.trim(),
        mode: "web",
      }, projectId ? "PATCH" : "POST");
      const project = toLocalProject(data.project);
      const projects = [...state.projects.filter((item) => item.id !== project.id), project];
      update({ projects, loaded: true, error: "" });
      return project;
    },
  };
}

export function workspaceStore(accountId: string) {
  let store = stores.get(accountId);
  if (!store) { store = createProjectStore(); stores.set(accountId, store); }
  return store;
}

export function saveProject(accountId: string, details: ProjectDetails, projectId?: string) {
  return workspaceStore(accountId).save(details, projectId);
}
