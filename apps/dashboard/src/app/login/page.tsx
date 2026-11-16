import type { Metadata } from "next";
import Login from "@/containers/Login";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in with Discord to access your private Lumen Radar dashboard and manage your Stellar projects.",
  alternates: { canonical: "/login" },
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <Login callbackError={params.error !== undefined} />;
}
