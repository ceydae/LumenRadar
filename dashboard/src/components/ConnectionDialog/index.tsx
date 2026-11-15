"use client";

import { Dialog } from "@animate-ui/react/primitives/radix-ui/dialog";
import { X } from "lucide-react";
import type { Project } from "@/types/analytics";
import { getSourceStatus } from "@/utils/project";

export default function ConnectionDialog({
  open,
  onOpenChange,
  project,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <Dialog.Title>Connection details</Dialog.Title>
          <Dialog.Description>
            Connection information for your project’s website and API services.
          </Dialog.Description>
          <dl>
            <div>
              <dt>Website</dt>
              <dd>{project.domain}</dd>
            </div>
            <div>
              <dt>Web analytics</dt>
              <dd>
                {getSourceStatus(project.webConnected, project.webConfigured)}
              </dd>
            </div>
            <div>
              <dt>API analytics</dt>
              <dd>
                {getSourceStatus(project.apiConnected, project.apiConfigured)}
              </dd>
            </div>
            <div>
              <dt>API service</dt>
              <dd>{project.serviceName || "Not selected"}</dd>
            </div>
          </dl>
          <Dialog.Close
            className="dialog-close"
            aria-label="Close connection details"
          >
            <X size={18} aria-hidden="true" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
