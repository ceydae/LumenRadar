"use client";

import { useState, type FormEvent } from "react";
import InputField from "@/components/InputField";
import FormSubmit from "@/components/FormSubmit";
import { saveProject } from "@/lib/workspace";
import type { LocalProject } from "@/types/workspace";

export default function ProjectForm({
  accountId,
  project,
  onComplete,
}: {
  accountId: string;
  project: LocalProject | null;
  onComplete: (project: LocalProject) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [description, setDescription] = useState(project?.stellarDescription ?? "");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    const fields = new FormData(form);
    setPending(true);
    setError("");
    try {
      const saved = await saveProject(accountId, {
        name: String(fields.get("projectName") ?? ""),
        websiteUrl: String(fields.get("website") ?? ""),
        stellarDescription: String(fields.get("description") ?? ""),
      }, project?.id);
      onComplete(saved);
      setPending(false);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your project could not be saved. Please try again.",
      );
      setPending(false);
    }
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
        maxLength={80}
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
          onChange={(event) => setDescription(event.target.value)}
          aria-describedby="description-count"
          required
          maxLength={200}
          disabled={pending}
        />
        <span className="field-hint" id="description-count">
          {description.length}/200 characters
        </span>
      </div>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <FormSubmit pending={pending}>Continue to data sources</FormSubmit>
    </form>
  );
}
