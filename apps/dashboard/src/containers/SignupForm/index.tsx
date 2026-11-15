"use client";

import { useState, type FormEvent } from "react";
import InputField from "@/components/InputField";
import FormSubmit from "@/components/FormSubmit";
import PasswordField from "@/containers/PasswordField";
import { EMAIL_PATTERN } from "@/constants/auth";
import { registerAccount } from "@/lib/workspace";

export default function SignupForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const confirmation = form.elements.namedItem(
      "confirmation",
    ) as HTMLInputElement;
    confirmation.setCustomValidity(
      fields.get("password") === fields.get("confirmation")
        ? ""
        : "Your passwords do not match.",
    );
    if (fields.get("password") !== fields.get("confirmation")) {
      setError("Your passwords do not match.");
    }
    if (!form.reportValidity()) return;
    setError("");
    setPending(true);
    try {
      registerAccount(
        String(fields.get("name") ?? ""),
        String(fields.get("email") ?? ""),
      );
      form.reset();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Your account could not be saved. Allow site storage and try again.",
      );
      setPending(false);
    }
  }
  return (
    <form
      className="login-form signup-form"
      onSubmit={handleSubmit}
      aria-busy={pending}
    >
      <InputField
        id="name"
        name="name"
        label="Full name"
        placeholder="Your name"
        autoComplete="name"
        required
        pattern={String.raw`.*\S.*`}
        maxLength={80}
        disabled={pending}
      />
      <InputField
        id="email"
        name="email"
        label="Email address"
        placeholder="you@company.com"
        type="email"
        autoComplete="email"
        required
        pattern={EMAIL_PATTERN}
        title="Enter an email address such as you@company.com."
        maxLength={254}
        disabled={pending}
      />
      <PasswordField
        id="password"
        name="password"
        label="Password"
        placeholder="At least 6 characters"
        autoComplete="new-password"
        required
        minLength={6}
        maxLength={128}
        disabled={pending}
        onInput={(event) => {
          const confirmation = event.currentTarget.form?.elements.namedItem(
            "confirmation",
          ) as HTMLInputElement | null;
          confirmation?.setCustomValidity("");
        }}
      />
      <PasswordField
        id="confirmation"
        name="confirmation"
        label="Confirm password"
        placeholder="Re-enter your password"
        autoComplete="new-password"
        required
        minLength={6}
        maxLength={128}
        disabled={pending}
        onInput={(event) => event.currentTarget.setCustomValidity("")}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <FormSubmit pending={pending} pendingLabel="Creating account">
        Create account
      </FormSubmit>
    </form>
  );
}
