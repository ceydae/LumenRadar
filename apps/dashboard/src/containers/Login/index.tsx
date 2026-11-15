"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Brand from "@/components/Brand";
import SessionLoading from "@/components/SessionLoading";
import LoginForm from "@/containers/LoginForm";
import SignupForm from "@/containers/SignupForm";
import { useLocalSession } from "@/hooks/useLocalSession";

export default function Login({
  mode = "login",
}: {
  mode?: "login" | "signup";
}) {
  const signup = mode === "signup";
  const router = useRouter();
  const { status } = useLocalSession();
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
              {signup ? "Start with your account." : "Welcome back."}
            </h1>
            <p>
              {signup
                ? "A workspace for your project starts here."
                : "Sign in to your Lumen Radar workspace."}
            </p>
          </div>
          {signup ? <SignupForm /> : <LoginForm />}
          <div className="login-help">
            {signup ? (
              <>
                Already have an account? <Link href="/login">Sign in</Link>
              </>
            ) : (
              <>
                New to Lumen Radar?{" "}
                <Link href="/signup">Create an account</Link>
              </>
            )}
          </div>
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
