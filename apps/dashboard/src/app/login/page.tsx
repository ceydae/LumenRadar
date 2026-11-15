import type { Metadata } from "next";
import Login from "@/containers/Login";

export const metadata: Metadata = { title: "Sign in · Lumen Radar" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;
  return <Login callbackError={params.error !== undefined} />;
}
