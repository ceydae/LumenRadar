import type { ReactNode } from "react";
import ActivitySkeleton from "@/components/ActivitySkeleton";
import Skeleton from "@/components/Skeleton";
import InstallationGuide from "@/components/InstallationGuide";
import DashboardFrame from "@/containers/DashboardFrame";

export default function DashboardSkeleton({
  sidebar,
  header,
}: {
  sidebar: ReactNode;
  header: ReactNode;
}) {
  return (
    <DashboardFrame header={header} sidebar={sidebar}>
      <main
        id="main-content"
        className="project-installation-page"
        aria-busy="true"
      >
        <span className="sr-only" role="status">
          Loading project details…
        </span>
        <div className="installation-banner">
          <div>
            <h1>Website analytics</h1>
            <Skeleton className="skeleton-banner-line" />
          </div>
        </div>
        <div className="web-analytics">
          <section className="panel website-activity-panel">
            <div className="panel-heading">
              <div>
                <h2>Website activity</h2>
                <p>Page views for the selected period.</p>
              </div>
            </div>
            <ActivitySkeleton />
          </section>
        </div>
        <div className="project-setup-grid">
          <section className="website-installation">
            <div className="installation-body">
              <h2 className="skeleton-section-heading">
                Install website analytics
              </h2>
              <div className="skeleton-copy skeleton-installation">
                <Skeleton />
                <Skeleton className="skeleton-long" />
                <Skeleton className="skeleton-code" />
              </div>
            </div>
          </section>
          <InstallationGuide />
        </div>
      </main>
    </DashboardFrame>
  );
}
