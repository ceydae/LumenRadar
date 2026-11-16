"use client";
import { useState } from "react";
import { LogOut } from "lucide-react";
import Brand from "@/components/Brand";
import ThemeToggle from "@/components/ThemeToggle";
import { signOut } from "@/lib/session";

export default function AccountHeader({ name }: { name: string }) {
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  async function handleSignOut() {
    setPending(true);
    setError("");
    try { await signOut(); }
    catch { setError("Couldn't sign out. Please try again."); setPending(false); }
  }
  return (
    <header className="setup-header">
      <Brand />
      <div className="setup-account">
        <ThemeToggle />
        {error && <p className="form-error" role="alert">{error}</p>}
        <span>{name}</span>
        <button type="button" className="icon-button" aria-label="Sign out" disabled={pending} onClick={handleSignOut}>
          <LogOut size={17} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
