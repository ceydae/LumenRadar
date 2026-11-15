"use client";

import { useMemo, useSyncExternalStore } from "react";
import {
  getServerSessionSnapshot,
  getSessionSnapshot,
  parseSession,
  subscribeToSession,
} from "@/lib/session";

export function useLocalSession() {
  const snapshot = useSyncExternalStore<string | null | undefined>(
    subscribeToSession,
    getSessionSnapshot,
    getServerSessionSnapshot,
  );
  const session = useMemo(() => parseSession(snapshot), [snapshot]);
  return {
    session,
    status:
      snapshot === undefined
        ? ("loading" as const)
        : session
          ? ("authenticated" as const)
          : ("unauthenticated" as const),
  };
}
