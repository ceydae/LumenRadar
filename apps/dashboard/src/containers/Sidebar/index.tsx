import {
  ArrowUpRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { navigation } from "@/constants/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";
import Brand from "@/components/Brand";
import ThemeToggle from "@/components/ThemeToggle";

export default function Sidebar({
  collapsed,
  onToggle,
  email,
  onSignOut,
}: {
  collapsed: boolean;
  onToggle: () => void;
  email: string;
  onSignOut: () => void;
}) {
  return (
    <aside
      className={cn("sidebar", collapsed && "sidebar-collapsed")}
      aria-label="Main navigation"
    >
      <Brand />
      <div className="workspace-label sidebar-label">PROJECT WORKSPACE</div>
      <nav>
        <ul>
          {navigation.map(({ label, icon: Icon, available }) => (
            <li key={label}>
              {available ? (
                <Link
                  className="nav-item nav-active"
                  href="/"
                  aria-current="page"
                  aria-label={label}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="sidebar-label">{label}</span>
                </Link>
              ) : (
                <button
                  className="nav-item"
                  disabled
                  title={`${label} — coming soon`}
                  aria-label={`${label} — coming soon`}
                >
                  <Icon size={18} aria-hidden="true" />
                  <span className="sidebar-label">{label}</span>
                  <span className="soon sidebar-label">Soon</span>
                </button>
              )}
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <ThemeToggle showLabel />
        <a
          className="resource-link"
          aria-label="SCF program handbook (opens in a new tab)"
          href="https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track"
          target="_blank"
          rel="noreferrer"
        >
          <span className="sidebar-label">SCF program handbook</span>
          <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <div className="workspace-profile">
          <span className="avatar">{email.slice(0, 2).toUpperCase()}</span>
          <div className="sidebar-label">
            <strong>Workspace</strong>
            <span className="account-email" title={email}>
              {email}
            </span>
          </div>
          <button
            className="icon-button collapse-button"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            {collapsed ? (
              <PanelLeftOpen size={17} />
            ) : (
              <PanelLeftClose size={17} />
            )}
          </button>
        </div>
        <button
          type="button"
          className="signout-button"
          onClick={onSignOut}
          aria-label="Sign out"
        >
          <LogOut size={16} aria-hidden="true" />
          <span className="sidebar-label">Sign out</span>
        </button>
      </div>
    </aside>
  );
}
