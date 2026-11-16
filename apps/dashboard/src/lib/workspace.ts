import type { LocalProject } from "../types/workspace";
import { expireSession, getSessionSnapshot, subscribeToSession } from "./session.ts";

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
  umamiWebsiteId: string | null;
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
    umamiWebsiteId: project.umamiWebsiteId ?? null,
  };
}
type ProjectState = { projects: LocalProject[]; loaded: boolean; error: string };
const initialState: ProjectState = { projects: [], loaded: false, error: "" };
const stores = new Map<string, ReturnType<typeof createProjectStore>>();

export class ProjectRequestError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message); this.status = status; this.code = code;
  }
}

export async function projectRequest(path = "", body?: object, method = body ? "POST" : "GET", signal?: AbortSignal) {
  const account = getSessionSnapshot().session?.id;
  let response: Response;
  try { response = await fetch(`${API_URL}/api/projects${path}`, {
    method,
    credentials: "include",
    cache: "no-store",
    signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(15000)]) : AbortSignal.timeout(15000),
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  }); } catch (error) {
    if (signal?.aborted) throw error;
    throw new Error("The project service couldn't be reached. Check your connection and try again.");
  }
  if (response.status === 204) return undefined;
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    if (response.status === 401 && getSessionSnapshot().session?.id === account) expireSession();
    throw new ProjectRequestError(data?.message || "Your projects couldn't be loaded. Please try again.", response.status, data?.code);
  }
  if (!data) throw new Error("The project service returned an invalid response. Please try again.");
  return data;
}

function createProjectStore() {
  let state = initialState;
  let loading: Promise<void> | undefined;
  let revision = 0;
  const listeners = new Set<() => void>();
  function update(next: ProjectState) {
    state = next;
    listeners.forEach((listener) => listener());
  }
  return {
    reset() {
      revision++;
      loading = undefined;
      update(initialState);
    },
    getSnapshot: () => state,
    getServerSnapshot: () => initialState,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
    load() {
      if (loading) return loading;
      const current = revision;
      loading = (async () => {
        try {
          const data: { projects: ApiProject[] } = await projectRequest();
          if (current !== revision) return;
          const projects = data.projects.map(toLocalProject);
          update({ projects, loaded: true, error: "" });
        } catch (error) {
          if (current !== revision) return;
          update({ ...state, loaded: true, error: error instanceof Error ? error.message : "Your projects couldn't be loaded. Please try again." });
        } finally { if (current === revision) loading = undefined; }
      })();
      return loading;
    },
    async save(details: ProjectDetails, projectId?: string) {
      const current = ++revision;
      loading = undefined;
      if (!details.stellarDescription.trim()) throw new Error("Describe how your project uses Stellar.");
      if (details.stellarDescription.trim().length > MAX_DESCRIPTION_LENGTH)
        throw new Error("Keep your description to 200 characters or fewer.");
      let data: { project: ApiProject };
      try { data = await projectRequest(projectId ? `/${encodeURIComponent(projectId)}` : "", {
        streamName: details.name.trim(),
        websiteUrl: details.websiteUrl.trim(),
        description: details.stellarDescription.trim(),
        mode: "web",
      }, projectId ? "PATCH" : "POST"); }
      catch (error) {
        if (error instanceof ProjectRequestError && (error.code === "PROJECT_LIMIT_REACHED" || error.status === 404)) void this.load();
        throw error;
      }
      const project = toLocalProject(data.project);
      if (current !== revision) throw new Error("Your workspace changed. Please try again.");
      revision++;
      loading = undefined;
      const projects = state.projects.some((item) => item.id === project.id)
        ? state.projects.map((item) => item.id === project.id ? project : item)
        : [project, ...state.projects];
      update({ projects, loaded: true, error: "" });
      await this.load();
      return project;
    },
    async detail(id: string) {
      const current = revision;
      let data: { project: ApiProject };
      try { data = await projectRequest(`/${encodeURIComponent(id)}`); }
      catch (error) {
        if (current === revision && error instanceof ProjectRequestError && error.status === 404) {
          update({ ...state, projects: state.projects.filter((project) => project.id !== id) });
          void this.load();
        }
        throw error;
      }
      if (current !== revision) throw new DOMException("This project request is no longer current.", "AbortError");
      const project = toLocalProject(data.project);
      update({ ...state, projects: state.projects.some((item) => item.id === id)
        ? state.projects.map((item) => item.id === id ? project : item)
        : [...state.projects, project] });
      return project;
    },
    async remove(id: string) {
      const current = ++revision;
      loading = undefined;
      try { await projectRequest(`/${encodeURIComponent(id)}`, undefined, "DELETE"); }
      catch (error) {
        // An already deleted project is also absent from this workspace.
        if (!(error instanceof ProjectRequestError && error.status === 404)) throw error;
      }
      if (current !== revision) throw new Error("Your workspace changed. Please try again.");
      revision++;
      loading = undefined;
      update({ projects: state.projects.filter((item) => item.id !== id), loaded: true, error: "" });
      await this.load();
    },
    async setup(id: string) {
      const current = revision;
      const data: { websiteId: string } = await projectRequest(`/${encodeURIComponent(id)}/analytics/setup`, {});
      if (current !== revision) throw new Error("Your workspace changed. Please try again.");
      if (typeof data.websiteId !== "string" || !data.websiteId) throw new Error("Analytics setup returned an invalid website ID. Please retry setup.");
      revision++;
      loading = undefined;
      update({ ...state, projects: state.projects.map((project) => project.id === id ? { ...project, umamiWebsiteId: data.websiteId } : project) });
      await this.load();
      return data.websiteId;
    },
  };
}

let previousAccount = getSessionSnapshot().session?.id;
subscribeToSession(() => {
  const account = getSessionSnapshot().session?.id;
  if (account !== previousAccount || getSessionSnapshot().status === "unauthenticated") {
    stores.forEach((store) => store.reset());
  }
  previousAccount = account;
});

export function workspaceStore(accountId: string) {
  let store = stores.get(accountId);
  if (!store) { store = createProjectStore(); stores.set(accountId, store); }
  return store;
}

export function saveProject(accountId: string, details: ProjectDetails, projectId?: string) {
  return workspaceStore(accountId).save(details, projectId);
}
