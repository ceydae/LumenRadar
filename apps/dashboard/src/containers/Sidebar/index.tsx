"use client";

import {
  ArrowUpRight,
  PanelLeftClose,
  PanelLeftOpen,
  BookOpen,
  Code2,
} from "lucide-react";
import { navigation } from "@/constants/navigation";
import Link from "next/link";
import { cn } from "@/utils/cn";
import ProjectSwitcher from "@/components/ProjectSwitcher";
import Skeleton from "@/components/Skeleton";
import type { Project } from "@/types/analytics";
import * as SidebarPrimitive from "@animate-ui/react/primitives/sidebar";
import { Button } from "@animate-ui/react/primitives/buttons/button";

export default function Sidebar({
  collapsed,
  onToggle,
  project,
  projects = [],
  onProjectChange,
}: {
  collapsed: boolean;
  onToggle: () => void;
  project?: Project;
  projects?: Project[];
  onProjectChange?: (id: string) => void;
}) {
  return (
    <SidebarPrimitive.Provider
      open={!collapsed}
      onOpenChange={(open) => {
        if (open === collapsed) onToggle();
      }}
      className="sidebar-provider"
    >
      <SidebarPrimitive.Container
        className={cn("sidebar", collapsed && "sidebar-collapsed")}
        role="complementary"
        aria-label="Main navigation"
        data-collapsible={collapsed ? "icon" : ""}
        style={{ transitionProperty: "left, right, width, padding" }}
      >
        <SidebarPrimitive.Highlight className="sidebar-inner">
          <div className="sidebar-project-switcher">
            {project ? (
              <ProjectSwitcher
                project={project}
                projects={projects}
                onProjectChange={onProjectChange}
              />
            ) : (
              <div className="sidebar-project-loading" aria-busy="true">
                <span className="sr-only">Loading project…</span>
                <Skeleton className="skeleton-icon" />
                <div
                  className="skeleton-copy sidebar-label"
                  data-sidebar="group-label"
                >
                  <Skeleton className="skeleton-title" />
                  <Skeleton className="skeleton-label" />
                </div>
              </div>
            )}
          </div>
          <nav>
            <ul>
              {navigation.map(({ label, icon: Icon, available }) => (
                <li key={label}>
                  {available ? (
                    <Link
                      className="nav-item nav-active"
                      data-sidebar="menu-button"
                      href="/"
                      aria-current="page"
                      aria-label={label}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span className="sidebar-label">{label}</span>
                    </Link>
                  ) : (
                    <Button
                      className="nav-item"
                      data-sidebar="menu-button"
                      disabled
                      title={`${label} — coming soon`}
                      aria-label={`${label} — coming soon`}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span className="sidebar-label">{label}</span>
                      <span className="soon sidebar-label">Soon</span>
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </nav>
          <div className="sidebar-bottom">
            <a
              className="resource-link sidebar-project-resource"
              href="https://docs.lumenradar.org"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lumen Radar documentation (opens in a new tab)"
              title="Documentation"
            >
              <BookOpen size={16} aria-hidden="true" />
              <span data-sidebar="group-label" className="sidebar-label">
                Documentation
              </span>
              <ArrowUpRight
                data-sidebar="group-label"
                className="sidebar-label"
                size={14}
                aria-hidden="true"
              />
            </a>
            <a
              className="resource-link sidebar-project-resource"
              href="https://github.com/ceydae/LumenRadar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Lumen Radar on GitHub (opens in a new tab)"
              title="GitHub"
            >
              <Code2 size={16} aria-hidden="true" />
              <span data-sidebar="group-label" className="sidebar-label">
                GitHub
              </span>
              <ArrowUpRight
                data-sidebar="group-label"
                className="sidebar-label"
                size={14}
                aria-hidden="true"
              />
            </a>
            <a
              className="resource-link"
              aria-label="SCF program handbook (opens in a new tab)"
              href="https://stellar.gitbook.io/scf-handbook/scf-awards/build-award/rfp-track"
              target="_blank"
              rel="noreferrer"
            >
              <span data-sidebar="group-label" className="sidebar-label">
                SCF program handbook
              </span>
              <ArrowUpRight size={15} aria-hidden="true" />
            </a>
            <div className="sidebar-collapse-row">
              <Button
                className="icon-button collapse-button"
                onClick={onToggle}
                aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                aria-expanded={!collapsed}
              >
                <SidebarPrimitive.TriggerIcon
                  open={<PanelLeftClose size={17} />}
                  closed={<PanelLeftOpen size={17} />}
                />
              </Button>
            </div>
          </div>
        </SidebarPrimitive.Highlight>
      </SidebarPrimitive.Container>
    </SidebarPrimitive.Provider>
  );
}
