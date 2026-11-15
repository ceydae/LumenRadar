"use client";
import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import ConnectionChoice from "@/components/ConnectionChoice";
import FormSubmit from "@/components/FormSubmit";
import { connectionOptions } from "@/constants/connections";
import { saveConnection } from "@/lib/workspace";
import type { LocalProject } from "@/types/workspace";

export default function ConnectionSetup({ accountId, project, onBack, onComplete }: {
  accountId: string;
  project: LocalProject;
  onBack: () => void;
  onComplete: () => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    setPending(true);
    setError("");
    try {
      await saveConnection(accountId, project.id);
      onComplete();
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
      <div className="setup-actions">
        <button type="button" className="back-button" onClick={onBack} disabled={pending}>
          <ArrowLeft size={15} aria-hidden="true" /> Back
        </button>
        <FormSubmit pending={pending} pendingLabel="Opening project">Open project</FormSubmit>
      </div>
    </form>
  );
}
