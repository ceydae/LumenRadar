"use client";
import { useEffect, useRef, useState } from "react";
import { Check, Info, Code2, Copy, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@animate-ui/react/primitives/buttons/button";
import { CopyButton, CopyButtonIcon } from "@animate-ui/react/primitives/buttons/copy";
import { Dialog } from "@animate-ui/react/primitives/radix-ui/dialog";
import { AlertDialog } from "@animate-ui/react/primitives/radix-ui/alert-dialog";
import type { LocalProject } from "@/types/workspace";
import ProjectForm from "@/containers/ProjectForm";
import { saveProject, workspaceStore, type ProjectDetails } from "@/lib/workspace";
import { trackingSnippet } from "@/lib/analytics";

export default function WebsiteInstallation({ project, accountId, onDeleted }: { project: LocalProject; accountId: string; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [copied, setCopied] = useState(false);
  const copyTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(copyTimeout.current), []);
  const [setupPending, setSetupPending] = useState(false);
  const [setupError, setSetupError] = useState("");
  let snippet = "";
  let snippetError = "";
  if (project.umamiWebsiteId) {
    try { snippet = trackingSnippet(project.umamiWebsiteId); }
    catch { snippetError = "The public analytics URL is invalid. Ask your dashboard administrator to check the configuration."; }
  }
  async function setup() {
    if (setupPending) return;
    setSetupPending(true); setSetupError("");
    try { await workspaceStore(accountId).setup(project.id); }
    catch (error) { setSetupError(error instanceof Error ? error.message : "Analytics setup failed. Please retry."); }
    finally { setSetupPending(false); }
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setNotice("Tracking script copied. Add it to your website’s <head>.");
      clearTimeout(copyTimeout.current);
      copyTimeout.current = setTimeout(() => setCopied(false), 2500);
    }
    catch { setCopied(false); setNotice("Copy failed. Select and copy the script above."); }
  }
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
          <div className="installation-title"><Code2 size={20} aria-hidden="true" /><h2 id="installation-title" tabIndex={-1}>Install website analytics</h2></div>
          <span className="installation-availability">{project.umamiWebsiteId ? "Ready to install" : "Setup required"}</span>
        </div>
        <div className="installation-copy">
          <p>Your project is saved for <strong>{new URL(project.websiteUrl).hostname}</strong>.</p>
          <p>{project.umamiWebsiteId ? "Add this script to the <head> of your website, publish it, then visit a page and refresh the pageview count above." : "Set up analytics to get your website’s tracking script. Your saved project will be kept if setup needs to be retried."}</p>
        </div>
        {snippet && <div className="tracking-code">
          <div className="tracking-code-toolbar"><span>Tracking script</span>
            <CopyButton type="button" className="secondary-button copy-script-button" content={snippet} copied={copied} onClick={(event) => { event.preventDefault(); void copy(); }} aria-label={copied ? "Tracking script copied" : "Copy tracking script"}>
              <CopyButtonIcon className="copy-script-icon" icon={<Copy size={14} aria-hidden="true" />} copiedIcon={<Check size={14} aria-hidden="true" />} /><span>Copy script</span>
            </CopyButton>
          </div>
          <pre tabIndex={0} aria-label="Website tracking script"><code>{snippet}</code></pre>
        </div>}
        {!project.umamiWebsiteId && <Button type="button" className="primary-button setup-analytics-button" disabled={setupPending} aria-busy={setupPending} onClick={() => void setup()}>{setupPending ? "Setting up analytics…" : "Set up analytics"}</Button>}
        {(setupError || snippetError) && <p className="form-error" role="alert">{setupError || snippetError}</p>}
        <p className="installation-note"><Info size={16} aria-hidden="true" /><span>Setup makes the script available. Recorded page views above confirm traffic; setup alone does not confirm installation.</span></p>
        <p className="installation-feedback" role="status">{notice}</p>
      </div>
      <div className="installation-footer">
        <div className="installation-project-details"><h3 id="project-settings" tabIndex={-1}>Project settings</h3><span className="installation-project-name"><bdi>{project.name}</bdi></span></div>
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
              <Button type="button" className="installation-delete" aria-label="Delete project" title="Delete project"><Trash2 size={16} aria-hidden="true" /><span>Delete</span></Button>
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
    </section>
  );
}
