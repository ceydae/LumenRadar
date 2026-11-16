import Skeleton from "@/components/Skeleton";

export default function ActivitySkeleton() {
  return (
    <div className="activity-summary" aria-hidden="true">
      <div className="activity-measure">
        <Skeleton className="skeleton-label" />
        <Skeleton className="skeleton-number" />
        <Skeleton className="skeleton-label" />
      </div>
      <div className="activity-state">
        <Skeleton className="skeleton-icon" />
        <div className="skeleton-copy">
          <Skeleton className="skeleton-title" />
          <Skeleton />
          <Skeleton className="skeleton-long" />
        </div>
      </div>
    </div>
  );
}
