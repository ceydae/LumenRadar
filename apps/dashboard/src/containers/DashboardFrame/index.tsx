import type { ReactNode } from "react";

export default function DashboardFrame({
  header,
  sidebar,
  children,
}: {
  header: ReactNode;
  sidebar: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="dashboard-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      {header}
      <div className="dashboard">
        {sidebar}
        <div className="dashboard-body">{children}</div>
      </div>
    </div>
  );
}
