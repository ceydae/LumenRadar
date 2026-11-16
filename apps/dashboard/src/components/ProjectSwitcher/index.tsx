"use client";

import { Check, ChevronsUpDown, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { DropdownMenu } from "@animate-ui/react/primitives/radix-ui/dropdown-menu";
import type { Project } from "@/types/analytics";

export default function ProjectSwitcher({
  projects,
  project,
  onProjectChange,
}: {
  projects: Project[];
  project: Project;
  onProjectChange?: (id: string) => void;
}) {
  const identity = (
    <>
      <span className="header-project-mark" aria-hidden="true">
        {project.initials}
      </span>
      <span
        className="header-project-copy sidebar-label"
        data-sidebar="group-label"
      >
        <span className="header-project-name">
          <bdi>{project.name}</bdi>
        </span>
        <span className="header-project-domain">
          <bdi>{project.domain}</bdi>
        </span>
      </span>
    </>
  );
  if (!onProjectChange) {
    return <div className="header-project-identity">{identity}</div>;
  }
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        className="header-project-identity header-project-trigger"
        aria-label={`Switch project: ${project.name}`}
      >
        {identity}
        <ChevronsUpDown
          size={16}
          className="header-project-chevron sidebar-label"
          data-sidebar="group-label"
          aria-hidden="true"
        />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="project-switcher-menu"
          align="start"
          side="right"
          sideOffset={12}
          collisionPadding={16}
        >
          <DropdownMenu.Label className="project-switcher-label">
            Switch project
          </DropdownMenu.Label>
          <DropdownMenu.RadioGroup
            value={project.id}
            onValueChange={onProjectChange}
          >
            {projects.map((item) => (
              <DropdownMenu.RadioItem
                className="project-switcher-item"
                value={item.id}
                key={item.id}
                textValue={item.name}
              >
                <span className="project-switcher-mark" aria-hidden="true">
                  {item.initials}
                </span>
                <span className="project-switcher-copy">
                  <span>
                    <bdi>{item.name}</bdi>
                  </span>
                  <span className="project-switcher-domain">
                    <bdi>{item.domain}</bdi>
                  </span>
                </span>
                <DropdownMenu.ItemIndicator className="project-switcher-check">
                  <Check size={16} aria-hidden="true" />
                </DropdownMenu.ItemIndicator>
              </DropdownMenu.RadioItem>
            ))}
          </DropdownMenu.RadioGroup>
          <DropdownMenu.Separator className="project-switcher-separator" />
          <DropdownMenu.Item asChild className="project-switcher-all">
            <Link href="/">
              <LayoutGrid size={16} aria-hidden="true" /> All projects
            </Link>
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
