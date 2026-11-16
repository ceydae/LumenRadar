"use client";

import { useState, type FormEvent } from "react";
import InputField from "@/components/InputField";
import FormSubmit from "@/components/FormSubmit";
import type { ProjectDetails } from "@/lib/workspace";

export default function ProjectForm({
  project,
  onComplete,
  pending = false,
  submitLabel = "Continue to data sources",
  onCancel,
}: {
  project: ProjectDetails | null;
  onComplete: (project: ProjectDetails) => void;
  pending?: boolean;
  submitLabel?: string;
  onCancel?: () => void;
}) {
  const [description, setDescription] = useState(project?.stellarDescription ?? "");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const descriptionField = form.elements.namedItem("description") as HTMLTextAreaElement;
    descriptionField.setCustomValidity(description.trim() ? "" : "Describe how your project uses Stellar.");
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    onComplete({
      name: String(fields.get("projectName") ?? "").trim(),
      websiteUrl: String(fields.get("website") ?? "").trim(),
      stellarDescription: description.trim(),
    });
  }
  return (
    <form
      className="login-form project-form"
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      <InputField
        id="projectName"
        name="projectName"
        label="Project name"
        placeholder="e.g. Orbit"
        defaultValue={project?.name}
        required
        pattern={String.raw`.*\S.*`}
        maxLength={100}
        disabled={pending}
      />
      <InputField
        id="website"
        name="website"
        label="Website URL"
        placeholder="https://yourproject.com"
        type="url"
        defaultValue={project?.websiteUrl}
        required
        pattern="https?://.+"
        title="Use a full URL beginning with https:// or http://."
        maxLength={2048}
        disabled={pending}
      />
      <div className="input-field">
        <label htmlFor="description">How does your project use Stellar?</label>
        <textarea
          id="description"
          name="description"
          placeholder="Tell us briefly what you're building on Stellar."
          rows={4}
          value={description}
          onChange={(event) => {
            event.target.setCustomValidity("");
            setDescription(event.target.value);
          }}
          aria-describedby="description-count"
          required
          maxLength={200}
          disabled={pending}
        />
        <span className="field-hint" id="description-count">
          {description.length}/200 characters
        </span>
      </div>
      {onCancel ? (
        <div className="project-dialog-actions">
          <button type="button" className="secondary-button" disabled={pending} onClick={onCancel}>Cancel</button>
          <FormSubmit pending={pending}>{submitLabel}</FormSubmit>
        </div>
      ) : <FormSubmit pending={pending}>{submitLabel}</FormSubmit>}
    </form>
  );
}
