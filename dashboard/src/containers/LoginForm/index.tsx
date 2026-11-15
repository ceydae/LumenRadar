"use client";

import { useState, type FormEvent } from "react";
import InputField from "@/components/InputField";
import FormSubmit from "@/components/FormSubmit";
import PasswordField from "@/containers/PasswordField";
import { signIn } from "@/lib/session";
import { EMAIL_PATTERN } from "@/constants/auth";

export default function LoginForm() {
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
      signIn(String(new FormData(form).get("email") ?? ""));
      form.reset();
    } catch {
      setError(
        "Your browser couldn't save this session. Allow site storage and try again.",
      );
      setPending(false);
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit} aria-busy={pending}>
      <InputField
        id="email"
        name="email"
        label="Email address"
        type="email"
        pattern={EMAIL_PATTERN}
        title="Enter an email address such as you@company.com."
        autoComplete="email"
        placeholder="you@company.com"
        required
        maxLength={254}
        disabled={pending}
      />
      <PasswordField
        id="password"
        name="password"
        label="Password"
        autoComplete="current-password"
        placeholder="Enter your password"
        required
        minLength={6}
        maxLength={128}
        disabled={pending}
      />
      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
      <FormSubmit pending={pending} pendingLabel="Opening workspace">
        Sign in
      </FormSubmit>
    </form>
  );
}
