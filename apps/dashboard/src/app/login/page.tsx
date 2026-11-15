import type { Metadata } from "next";
import Login from "@/containers/Login";

export const metadata: Metadata = { title: "Sign in · Lumen Radar" };

export default function LoginPage() {
  return <Login />;
}
