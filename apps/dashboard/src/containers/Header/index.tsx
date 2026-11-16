"use client";

import { ChevronDown, LogOut } from "lucide-react";
import { DropdownMenu } from "@animate-ui/react/primitives/radix-ui/dropdown-menu";
import Brand from "@/components/Brand";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header({
  name,
  email,
  onSignOut,
}: {
  name: string;
  email: string;
  onSignOut: () => void;
}) {
  return (
    <header className="workspace-header">
      <Brand />
      <div className="workspace-header-actions">
        <ThemeToggle />
        <DropdownMenu.Root>
          <DropdownMenu.Trigger
            className="workspace-account-trigger"
            aria-label={`Account: ${name || email}`}
          >
            <span className="avatar" aria-hidden="true">
              {(name || email).slice(0, 2).toUpperCase()}
            </span>
            <span className="workspace-account-name">
              <bdi>{name || email}</bdi>
            </span>
            <ChevronDown size={14} aria-hidden="true" />
          </DropdownMenu.Trigger>
          <DropdownMenu.Portal>
            <DropdownMenu.Content
              className="workspace-account-menu"
              align="end"
              sideOffset={8}
              collisionPadding={12}
            >
              <DropdownMenu.Label className="workspace-account-label">
                <strong>{name || "Workspace"}</strong>
                <span>
                  <bdi>{email}</bdi>
                </span>
              </DropdownMenu.Label>
              <DropdownMenu.Separator className="project-switcher-separator" />
              <DropdownMenu.Item
                className="workspace-account-item"
                onSelect={onSignOut}
              >
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Portal>
        </DropdownMenu.Root>
      </div>
    </header>
  );
}
