"use client";
import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { workspaceStore } from "@/lib/workspace";
import type { LocalProject } from "@/types/workspace";

export function useWorkspace(accountId: string | undefined) {
  const store = useMemo(() => workspaceStore(accountId ?? ""), [accountId]);
  const state = useSyncExternalStore(store.subscribe, store.getSnapshot, store.getServerSnapshot);
  useEffect(() => {
    if (!accountId) return;
    void store.load();
    const refresh = () => { void store.load(); };
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [accountId, store]);
  return { workspace: { projects: state.projects }, loaded: state.loaded, error: state.error, retry: store.load };
}
// The route UUID is the selection; refreshing data must never select another project.
export function useProject(accountId: string | undefined, projectId: string, ready: boolean) {
  const [attempt, setAttempt] = useState(0);
  const key = JSON.stringify([accountId, projectId, ready, attempt]);
  const [state, setState] = useState<{ key: string; project: LocalProject | null; loaded: boolean; error: string }>({ key: "", project: null, loaded: false, error: "" });
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  useEffect(() => {
    if (!accountId || !ready) return;
    let active = true;
    const load = async () => {
      try {
        const project = await workspaceStore(accountId).detail(projectId);
        if (active) setState({ key, project, loaded: true, error: "" });
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        if (active) setState({ key, project: null, loaded: true, error: error instanceof Error ? error.message : "This project couldn't be loaded. Please try again." });
      }
    };
    void load();
    window.addEventListener("focus", load);
    return () => { active = false; window.removeEventListener("focus", load); };
  }, [accountId, projectId, ready, attempt, key]);
  return { ...(state.key === key ? state : { project: null, loaded: false, error: "" }), retry };
}
