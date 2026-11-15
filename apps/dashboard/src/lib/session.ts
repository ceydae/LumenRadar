// Browser-only flow state. Replace this module when server authentication is added.
// Passwords are never accepted or stored by this module.
import { isValidEmail } from "../constants/auth";
import { createBrowserStore } from "./browser-store";
const store = createBrowserStore("lumen-radar:session");

export interface LocalSession {
  version: 1;
  email: string;
}

export const getSessionSnapshot = store.getSnapshot;
export const getServerSessionSnapshot = store.getServerSnapshot;

export function parseSession(
  raw: string | null | undefined,
): LocalSession | null {
  if (!raw) return null;
  try {
    const value: unknown = JSON.parse(raw);
    if (
      typeof value !== "object" ||
      value === null ||
      !("version" in value) ||
      !("email" in value)
    )
      return null;
    if (
      value.version !== 1 ||
      typeof value.email !== "string" ||
      !isValidEmail(value.email)
    )
      return null;
    return { version: 1, email: value.email };
  } catch {
    return null;
  }
}

export const subscribeToSession = store.subscribe;

export function signIn(email: string) {
  if (!isValidEmail(email.trim()))
    throw new Error("Enter a valid email address.");
  const session: LocalSession = {
    version: 1,
    email: email.trim().toLowerCase(),
  };
  store.write(JSON.stringify(session));
}

export function signOut() {
  store.write(null);
}
