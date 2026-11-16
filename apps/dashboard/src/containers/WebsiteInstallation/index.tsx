"use client";
import { useState } from "react";
import { CirclePause, Code2, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@animate-ui/react/primitives/buttons/button";
import { Dialog } from "@animate-ui/react/primitives/radix-ui/dialog";
import { AlertDialog } from "@animate-ui/react/primitives/radix-ui/alert-dialog";
import type { LocalProject } from "@/types/workspace";
import ProjectForm from "@/containers/ProjectForm";
import { saveProject, workspaceStore, type ProjectDetails } from "@/lib/workspace";

export default function WebsiteInstallation({ project, accountId, onDeleted }: { project: LocalProject; accountId: string; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  function changeEditor(open: boolean) {
    if (pending) return;
    setEditing(open);
    setError("");
  }
  function changeConfirmation(open: boolean) {
    if (pending) return;
    setConfirming(open);
    setError("");
  }
  async function save(details: ProjectDetails) {
    if (pending) return;
    setPending(true); setError("");
    try { await saveProject(accountId, details, project.id); setEditing(false); setNotice("Project details saved."); }
    catch (error) { setError(error instanceof Error ? error.message : "Your changes couldn't be saved. Please try again."); }
    finally { setPending(false); }
  }
  async function remove() {
    if (pending) return;
    setPending(true); setError("");
    try { await workspaceStore(accountId).remove(project.id); onDeleted(); }
    catch (error) { setError(error instanceof Error ? error.message : "This project couldn't be deleted. Please try again."); setPending(false); }
  }
  return (
    <section className="website-installation" aria-labelledby="installation-title">
      <div className="installation-body">
        <div className="installation-heading">
          <div className="installation-title"><Code2 size={20} aria-hidden="true" /><h2 id="installation-title">Install website analytics</h2></div>
          <span className="installation-availability">Coming Soon</span>
        </div>
        <div className="installation-copy">
          <p>Your project is set up for <strong>{new URL(project.websiteUrl).hostname}</strong>.</p>
          <p>The tracking script is not available yet. Installation instructions will appear here when website tracking is ready.</p>
        </div>
        <p className="installation-note"><CirclePause size={16} aria-hidden="true" /><span>No installation is needed yet. This project is not collecting website analytics.</span></p>
      </div>
      <div className="installation-footer">
        <span className="installation-project-name"><bdi>{project.name}</bdi></span>
        <div className="installation-actions">
          <Dialog.Root open={editing} onOpenChange={changeEditor}>
            <Dialog.Trigger asChild>
              <Button type="button" className="secondary-button"><Pencil size={14} aria-hidden="true" />Edit project</Button>
            </Dialog.Trigger>
            <Dialog.Portal>
              <Dialog.Overlay className="dialog-overlay project-settings-overlay" />
              <Dialog.Content className="dialog-content project-settings-dialog" onInteractOutside={(event) => { if (pending) event.preventDefault(); }} onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }}>
                <Dialog.Title>Edit project</Dialog.Title>
                <Dialog.Description>Update the details for {project.name}.</Dialog.Description>
                <ProjectForm project={project} onComplete={(details) => void save(details)} pending={pending} submitLabel="Save changes" onCancel={() => changeEditor(false)} />
                {error && <p className="form-error" role="alert">{error}</p>}
                <Dialog.Close asChild><Button type="button" className="dialog-close" aria-label="Close project editor" disabled={pending}><X size={18} aria-hidden="true" /></Button></Dialog.Close>
              </Dialog.Content>
            </Dialog.Portal>
          </Dialog.Root>
          <AlertDialog.Root open={confirming} onOpenChange={changeConfirmation}>
            <AlertDialog.Trigger asChild>
              <Button type="button" className="installation-delete" aria-label="Delete project" title="Delete project"><Trash2 size={16} aria-hidden="true" /></Button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="dialog-overlay project-settings-overlay" />
              <AlertDialog.Content className="dialog-content project-delete-dialog" onEscapeKeyDown={(event) => { if (pending) event.preventDefault(); }} aria-busy={pending}>
                <AlertDialog.Title>Delete project?</AlertDialog.Title>
                <AlertDialog.Description>This permanently removes <strong>{project.name}</strong> and frees one project slot. This action cannot be undone.</AlertDialog.Description>
                {error && <p className="form-error" role="alert">{error}</p>}
                <div className="project-dialog-actions">
                  <AlertDialog.Cancel asChild><Button type="button" className="secondary-button" disabled={pending}>Cancel</Button></AlertDialog.Cancel>
                  <AlertDialog.Action asChild><Button type="button" className="primary-button project-delete-confirm" disabled={pending} onClick={(event) => { event.preventDefault(); void remove(); }}>{pending ? "Deleting…" : "Delete project"}</Button></AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      </div>
      <span className="sr-only" role="status">{notice}</span>
    </section>
  );
}
