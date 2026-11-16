"use client";
import { useEffect, useMemo, useSyncExternalStore } from "react";
import { workspaceStore } from "@/lib/workspace";

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
