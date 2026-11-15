"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Brand from "@/components/Brand";
import SessionLoading from "@/components/SessionLoading";
import LoginForm from "@/containers/LoginForm";
import { useSession } from "@/hooks/useSession";

export default function Login({ callbackError = false }: { callbackError?: boolean }) {
  const router = useRouter();
  const { status, error, retry } = useSession();
  useEffect(() => {
    if (status === "authenticated") router.replace("/");
  }, [status, router]);
  if (status !== "unauthenticated") return <SessionLoading />;

  return (
    <main className="login-page">
      <section className="login-main" aria-labelledby="login-title">
        <header className="login-header">
          <Brand tone="light" href="/login" />
        </header>
        <div className="login-content">
          <div className="login-heading">
            <h1 id="login-title">
              Your workspace starts here.
            </h1>
            <p>
              Continue with Discord to access Lumen Radar.
            </p>
          </div>
          {callbackError && <p className="form-error" role="alert">Discord sign-in wasn’t completed. Please try again.</p>}
          {error && <p className="form-error" role="alert">{error} <button type="button" className="session-retry" onClick={() => void retry()}>Retry</button></p>}
          <LoginForm />
          <p className="login-help">New here? Your account is created when you first continue with Discord.</p>
        </div>
        <footer className="login-footer">
          <span>© {new Date().getFullYear()} Lumen Radar</span>
          <span>Web & API analytics</span>
        </footer>
      </section>
      <aside className="login-brand-panel" aria-label="Lumen Radar">
        <div className="login-brand-top">
          <span>PROJECTS IN FOCUS</span>
          <span className="brand-panel-dot" aria-hidden="true" />
        </div>
        <div className="login-brand-art">
          <Image
            src="/brand/symbol-white.svg"
            alt=""
            width={190}
            height={218}
            priority
          />
        </div>
        <div className="login-brand-copy">
          <h2>
            Web traffic.
            <br />
            API activity.
            <br />
            One workspace.
          </h2>
          <p>
            Understand how people find your project
            <br className="desktop-break" /> and how your services are used.
          </p>
        </div>
        <div className="login-brand-bottom">
          <span>LUMEN RADAR</span>
          <span>STELLAR ECOSYSTEM</span>
        </div>
      </aside>
    </main>
  );
}
