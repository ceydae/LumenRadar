"use client";

import {
  Activity,
  CalendarDays,
  ChartNoAxesColumn,
  CircleAlert,
  Code2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@animate-ui/react/primitives/buttons/button";
import Panel from "@/components/Panel";
import SelectField from "@/components/SelectField";
import { dateRanges } from "@/lib/analytics";
import type { DateRange } from "@/types/analytics";
import LoadingContent from "@/components/LoadingContent";
import ActivitySkeleton from "@/components/ActivitySkeleton";

type Props = {
  status: "loading" | "ready" | "error" | "setup-required";
  pageviews: number | null;
  error: string;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
  onRefresh: () => void;
  canRefresh: boolean;
  initialLoading?: boolean;
};

export default function WebsiteActivity({
  status,
  pageviews,
  error,
  range,
  onRangeChange,
  onRefresh,
  canRefresh,
  initialLoading = false,
}: Props) {
  const hasTraffic = status === "ready" && pageviews !== null && pageviews > 0;
  const Icon =
    status === "error"
      ? CircleAlert
      : status === "setup-required"
        ? Code2
        : hasTraffic
          ? Activity
          : ChartNoAxesColumn;
  const title =
    status === "loading"
      ? "Checking website activity"
      : status === "error"
        ? "Activity unavailable"
        : status === "setup-required"
          ? "Connect your website"
          : hasTraffic
            ? "Traffic recorded"
            : "No page views yet";
  const description =
    status === "loading"
      ? "Loading page views for the selected period."
      : status === "error"
        ? error
        : status === "setup-required"
          ? "Set up analytics below, then add the tracking script to your website."
          : hasTraffic
            ? "These page views were recorded in the selected period. Refresh to check for new visits."
            : "Install the script and visit your website. Then refresh, or try a different date range.";
  return (
    <div id="website-activity" tabIndex={-1}>
      <Panel
        className="website-activity-panel"
        title="Website activity"
        description="Page views for the selected period."
        action={
          <div className="activity-controls">
            <div className="date-picker">
              <CalendarDays size={15} aria-hidden="true" />
              <SelectField
                label="Date range"
                value={range}
                options={dateRanges}
                onChange={(value) => onRangeChange(value as DateRange)}
              />
            </div>
            <Button
              type="button"
              className="secondary-button activity-refresh"
              onClick={onRefresh}
              disabled={status === "loading" || !canRefresh}
              aria-label="Refresh page views"
              title={
                !canRefresh
                  ? "Set up analytics before refreshing"
                  : "Refresh page views"
              }
            >
              <RefreshCw size={15} aria-hidden="true" />
              <span>Refresh</span>
            </Button>
          </div>
        }
      >
        <LoadingContent
          loading={initialLoading}
          skeleton={<ActivitySkeleton />}
          label="Loading website activity…"
        >
          <div className="activity-summary" aria-busy={status === "loading"}>
            <div className="activity-measure">
              <span className="activity-measure-label">Page views</span>
              <strong className="activity-value">
                {status === "ready" && pageviews !== null ? (
                  pageviews.toLocaleString()
                ) : (
                  <span aria-label="Not available">—</span>
                )}
              </strong>
              <span className="activity-period">
                {dateRanges.find((item) => item.value === range)?.label}
              </span>
            </div>
            <div
              className={`activity-state${hasTraffic ? " activity-state-success" : ""}${status === "error" ? " activity-state-error" : ""}`}
              role={status === "error" ? "alert" : "status"}
              aria-live="polite"
            >
              <span className="activity-state-icon">
                <Icon size={20} aria-hidden="true" />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                {status === "setup-required" && (
                  <a className="activity-setup-link" href="#installation-title">
                    Go to installation
                  </a>
                )}
                {status === "error" && (
                  <Button
                    type="button"
                    className="activity-setup-link"
                    onClick={onRefresh}
                    disabled={!canRefresh}
                  >
                    Try again
                  </Button>
                )}
              </div>
            </div>
          </div>
        </LoadingContent>
      </Panel>
    </div>
  );
}
