"use client";
import { useRef, useState, type FormEvent } from "react";
import { LoaderCircle } from "lucide-react";
import { signInWithDiscord } from "@/lib/session";
export default function LoginForm() {
  const submitting = useRef(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true;
    setPending(true);
    setError("");
    try { await signInWithDiscord(); }
    catch (error) {
      setError(error instanceof Error ? error.message : "Discord sign-in couldn't be started. Please try again.");
      submitting.current = false;
      setPending(false);
    }
  }
  return (
    <form className="login-form" onSubmit={handleSubmit} aria-busy={pending}>
      <button className="primary-button login-submit discord-submit" type="submit" disabled={pending}>
        {pending ? <LoaderCircle className="loading-spinner" size={20} aria-hidden="true" /> : (
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M20.3 4.4a19.8 19.8 0 0 0-4.9-1.5l-.6 1.2a18.5 18.5 0 0 0-5.6 0l-.6-1.2a19.8 19.8 0 0 0-4.9 1.5C.6 9 .2 13.5.4 18a20 20 0 0 0 6 3l1.2-2a13 13 0 0 1-1.9-.9l.5-.4a14 14 0 0 0 11.6 0l.5.4a13 13 0 0 1-1.9.9l1.2 2a20 20 0 0 0 6-3c.3-5.2-.8-9.7-3.3-13.6ZM8 15.4c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4Zm8 0c-1.2 0-2.1-1.1-2.1-2.4s.9-2.4 2.1-2.4 2.1 1.1 2.1 2.4-.9 2.4-2.1 2.4Z" />
          </svg>
        )}
        {pending ? "Connecting to Discord…" : "Continue with Discord"}
      </button>
      {error && <p className="form-error" role="alert">{error}</p>}
    </form>
  );
}
