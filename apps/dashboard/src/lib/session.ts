// Authentication uses only the API's HttpOnly session cookie.
export interface Session { id: string; email: string; name: string }
interface SessionState {
  session: Session | null;
  status: "loading" | "authenticated" | "unauthenticated";
  error: string;
}
const initialState: SessionState = { session: null, status: "loading", error: "" };
let state = initialState;
let request: Promise<void> | undefined;
let generation = 0;
const listeners = new Set<() => void>();
const apiUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3051").replace(/\/$/, "");
export async function authRequest(path: string, body?: object) {
  const response = await fetch(`${apiUrl}/api/auth/${path}`, {
    method: body ? "POST" : "GET", credentials: "include", cache: "no-store",
    signal: AbortSignal.timeout(15000),
    ...(body ? { headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) } : {}),
  });
  if (!response.ok) {
    if (response.status === 429) throw new Error("Too many attempts. Wait a minute and try again.");
    if (response.status === 401 && path === "get-session") return null;
    if (response.status === 503 || response.status === 404) throw new Error("Discord sign-in is unavailable. Please try again later.");
    throw new Error("We couldn't connect to your account. Please try again.");
  }
  return response.json();
}
function update(next: SessionState) { state = next; listeners.forEach((listener) => listener()); }
export const getSessionSnapshot = () => state;
export const getServerSessionSnapshot = () => initialState;
export function subscribeToSession(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
export function refreshSession() {
  if (request) return request;
  const current = generation;
  request = (async () => {
    try {
      const data = await authRequest("get-session");
      if (current !== generation) return;
      if (data === null) update({ session: null, status: "unauthenticated", error: "" });
      else if (typeof data.user?.id === "string" && typeof data.user?.email === "string" && data.session)
        update({ session: { id: data.user.id, email: data.user.email, name: data.user.name || data.user.email }, status: "authenticated", error: "" });
      else throw new Error("Invalid session response");
    } catch (error) {
      const networkError = error instanceof TypeError || (error instanceof Error && ["TimeoutError", "AbortError"].includes(error.name));
      const message = networkError
        ? "The account service couldn't be reached. Please try again."
        : error instanceof Error ? error.message : "Your session couldn't be checked. Please try again.";
      if (current === generation) update({ session: state.session, status: state.session ? "authenticated" : "unauthenticated", error: message });
    } finally { request = undefined; }
  })();
  return request;
}
export async function signInWithDiscord() {
  const data = await authRequest("sign-in/social", {
    provider: "discord", callbackURL: `${window.location.origin}/`, errorCallbackURL: `${window.location.origin}/login`,
  });
  const url = new URL(data.url);
  if (url.origin !== "https://discord.com" || !["/api/oauth2/authorize", "/oauth2/authorize"].includes(url.pathname))
    throw new Error("Discord sign-in couldn't be started. Please try again.");
  window.location.assign(url.href);
}
export async function signOut() {
  await authRequest("sign-out", {});
  generation++;
  update({ session: null, status: "unauthenticated", error: "" });
}
