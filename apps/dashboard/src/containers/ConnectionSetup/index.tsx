"use client";

import { useState, type FormEvent } from "react";
import { ArrowLeft } from "lucide-react";
import ConnectionChoice from "@/components/ConnectionChoice";
import InputField from "@/components/InputField";
import FormSubmit from "@/components/FormSubmit";
import { connectionOptions } from "@/constants/connections";
import { saveConnection } from "@/lib/workspace";
import type { ConnectionMode, LocalProject } from "@/types/workspace";

export default function ConnectionSetup({
  email,
  project,
  onBack,
}: {
  email: string;
  project: LocalProject;
  onBack: () => void;
}) {
  const [mode, setMode] = useState<ConnectionMode>(
    project.connectionMode ?? "web",
  );
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    setPending(true);
    setError("");
    try {
      saveConnection(
        email,
        mode,
        String(new FormData(form).get("serviceName") ?? ""),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your data sources could not be saved. Please try again.",
      );
      setPending(false);
    }
  }
  return (
    <form
      className="connection-form"
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      <fieldset className="connection-choices">
        <legend className="sr-only">Data sources</legend>
        {connectionOptions.map((option) => (
          <ConnectionChoice
            key={option.value}
            {...option}
            selected={mode === option.value}
            onSelect={setMode}
            disabled={pending}
          />
        ))}
      </fieldset>
      {mode !== "web" && (
        <InputField
          id="serviceName"
          name="serviceName"
          label="API service name"
          placeholder="e.g. payments-api"
          defaultValue={project.serviceName}
          pattern={String.raw`.*\S.*`}
          required
          maxLength={80}
          disabled={pending}
        />
      )}
      <p className="field-hint">
        Your workspace will be ready for the sources you select.
      </p>
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <div className="setup-actions">
        <button
          type="button"
          className="back-button"
          onClick={onBack}
          disabled={pending}
        >
          <ArrowLeft size={15} aria-hidden="true" />
          Back
        </button>
        <FormSubmit pending={pending} pendingLabel="Opening workspace">
          Open workspace
        </FormSubmit>
      </div>
    </form>
  );
}
