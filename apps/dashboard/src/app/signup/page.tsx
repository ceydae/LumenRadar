import type { Metadata } from "next";
import Login from "@/containers/Login";

export const metadata: Metadata = { title: "Create account · Lumen Radar" };
export default function SignupPage() {
  return <Login mode="signup" />;
}
