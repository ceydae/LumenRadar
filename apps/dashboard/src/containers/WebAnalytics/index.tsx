"use client";

import WebsiteActivity from "@/components/WebsiteActivity";
import { useAnalytics } from "@/hooks/useAnalytics";
import type { DateRange } from "@/types/analytics";
import type { LocalProject } from "@/types/workspace";

export default function WebAnalytics({
  accountId,
  project,
  range,
  onRangeChange,
}: {
  accountId: string;
  project: LocalProject;
  range: DateRange;
  onRangeChange: (range: DateRange) => void;
}) {
  const analytics = useAnalytics(
    accountId,
    project.id,
    project.umamiWebsiteId,
    range,
  );
  return (
    <div className="web-analytics">
      <WebsiteActivity
        status={analytics.status}
        initialLoading={analytics.initialLoading}
        pageviews={analytics.pageviews}
        error={analytics.error}
        range={range}
        onRangeChange={onRangeChange}
        onRefresh={analytics.retry}
        canRefresh={Boolean(project.umamiWebsiteId)}
      />
    </div>
  );
}
