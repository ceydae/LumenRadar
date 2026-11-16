"use client";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import ConnectionChoice from "@/components/ConnectionChoice";
import FormSubmit from "@/components/FormSubmit";
import { connectionOptions } from "@/constants/connections";
import { saveProject, workspaceStore, type ProjectDetails } from "@/lib/workspace";
import type { LocalProject } from "@/types/workspace";

export default function ConnectionSetup({ accountId, project, savedProject, onSaved, onBack, onComplete }: {
  accountId: string;
  project: ProjectDetails;
  savedProject: LocalProject | null;
  onSaved: (project: LocalProject) => void;
  onBack: () => void;
  onComplete: (project: LocalProject) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      const saved = savedProject ?? await saveProject(accountId, project);
      onSaved(saved);
      const websiteId = await workspaceStore(accountId).setup(saved.id);
      onComplete({ ...saved, umamiWebsiteId: websiteId });
    } catch (error) {
      setError(error instanceof Error ? error.message : "Your data source couldn't be saved. Please try again.");
      setPending(false);
    }
  }
  return (
    <form className="connection-form" onSubmit={handleSubmit} aria-busy={pending}>
      <fieldset className="connection-choices">
        <legend className="sr-only">Data sources</legend>
        {connectionOptions.map((option) => (
          <ConnectionChoice key={option.value} {...option}
            selected={option.value === "web"} onSelect={() => {}}
            comingSoon={option.value !== "web"} disabled={pending} />
        ))}
      </fieldset>
      <p className="field-hint">Start with website analytics. API analytics will be available later.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      {savedProject && <p className="field-hint">Your project is saved. Retry analytics setup or open the project to finish later.</p>}
      <div className="setup-actions">
        <button type="button" className="back-button" onClick={() => savedProject ? onComplete(savedProject) : onBack()} disabled={pending}>
          <ArrowLeft size={15} aria-hidden="true" /> {savedProject ? "Open saved project" : "Back"}
        </button>
        <FormSubmit pending={pending} pendingLabel="Setting up analytics">{savedProject ? "Retry analytics setup" : "Open project"}</FormSubmit>
      </div>
    </form>
  );
}
