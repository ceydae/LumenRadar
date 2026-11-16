"use client";
import { useCallback, useEffect, useState } from "react";
import { readPageviews } from "@/lib/analytics";
import { ProjectRequestError } from "@/lib/workspace";
import type { DateRange } from "@/types/analytics";

type AnalyticsState = { key: string; status: "loading" | "ready" | "error" | "setup-required"; pageviews: number | null; error: string };

export function useAnalytics(accountId: string | undefined, projectId: string, websiteId: string | null | undefined, range: DateRange) {
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt((value) => value + 1), []);
  const key = JSON.stringify([accountId, projectId, websiteId, range, attempt]);
  const [state, setState] = useState<AnalyticsState | null>(null);
  useEffect(() => {
    if (!accountId || !websiteId) return;
    const controller = new AbortController();
    void readPageviews(projectId, range, controller.signal).then((pageviews) => {
      if (!controller.signal.aborted) setState({ key, status: "ready", pageviews, error: "" });
    }).catch((error: unknown) => {
      if (controller.signal.aborted) return;
      setState({ key, status: error instanceof ProjectRequestError && error.code === "WEB_ANALYTICS_NOT_CONFIGURED" ? "setup-required" : "error", pageviews: null,
        error: error instanceof Error ? error.message : "Analytics couldn't be loaded. Please try again." });
    });
    return () => controller.abort();
  }, [accountId, projectId, websiteId, range, key]);
  const current: AnalyticsState = state?.key === key ? state : { key, status: websiteId ? "loading" : "setup-required", pageviews: null, error: "" };
  return { ...current, retry, initialLoading: current.status === "loading" && state === null };
}
