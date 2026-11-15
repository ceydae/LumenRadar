"use client";

import { useMemo, useSyncExternalStore } from "react";
import { parseWorkspace, workspaceStore } from "@/lib/workspace";

export function useWorkspace(email: string | undefined) {
  const store = useMemo(() => workspaceStore(email ?? ""), [email]);
  const snapshot = useSyncExternalStore<string | null | undefined>(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot,
  );
  const workspace = useMemo(
    () => parseWorkspace(snapshot, email ?? ""),
    [snapshot, email],
  );
  return { workspace, loaded: snapshot !== undefined };
}
