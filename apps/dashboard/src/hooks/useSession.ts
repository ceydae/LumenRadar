"use client";
import { useEffect, useSyncExternalStore } from "react";
import { getServerSessionSnapshot, getSessionSnapshot, refreshSession, subscribeToSession } from "@/lib/session";
export function useSession() {
  const state = useSyncExternalStore(subscribeToSession, getSessionSnapshot, getServerSessionSnapshot);
  useEffect(() => {
    void refreshSession();
    const refresh = () => { void refreshSession(); };
    const onVisibility = () => { if (document.visibilityState === "visible") refresh(); };
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", onVisibility);
    const timer = window.setInterval(refresh, 60000);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", onVisibility);
      window.clearInterval(timer);
    };
  }, []);
  return { ...state, retry: refreshSession };
}
