import assert from "node:assert/strict";
import { test } from "node:test";

let instance = 0;
const freshSession = () => import(`./session.ts?test=${instance++}`);

test("Discord session contract", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalWindow = globalThis.window;
  t.after(() => { globalThis.fetch = originalFetch; globalThis.window = originalWindow; });

  await t.test("rejects old local sessions and uses credentialed API reads", async () => {
    globalThis.window = { localStorage: { getItem: () => JSON.stringify({ version: 1, email: "fake@example.com" }) } };
    globalThis.fetch = async (url, options) => {
      assert.ok(url.endsWith("/api/auth/get-session"));
      assert.equal(options.credentials, "include");
      assert.equal(options.cache, "no-store");
      return Response.json(null);
    };
    const auth = await freshSession();
    await auth.refreshSession();
    assert.equal(auth.getSessionSnapshot().status, "unauthenticated");
    assert.equal(auth.getSessionSnapshot().session, null);
  });

  await t.test("loads a real API user and deduplicates session requests", async () => {
    let calls = 0;
    globalThis.fetch = async () => {
      calls++;
      return Response.json({ user: { id: "u1", email: "member@example.com", name: "Member" }, session: { id: "s1" } });
    };
    const auth = await freshSession();
    await Promise.all([auth.refreshSession(), auth.refreshSession()]);
    assert.equal(calls, 1);
    assert.equal(auth.getSessionSnapshot().session.id, "u1");
    assert.equal(auth.getSessionSnapshot().status, "authenticated");
  });

  await t.test("starts Discord with callback URLs and follows the authorization URL", async () => {
    let navigated;
    globalThis.window = { location: { origin: "http://localhost:3052", assign: (url) => { navigated = url; } } };
    globalThis.fetch = async (url, options) => {
      assert.ok(url.endsWith("/api/auth/sign-in/social"));
      assert.equal(options.credentials, "include");
      assert.equal(options.method, "POST");
      assert.deepEqual(JSON.parse(options.body), { provider: "discord", callbackURL: "http://localhost:3052/", errorCallbackURL: "http://localhost:3052/login" });
      return Response.json({ url: "https://discord.com/api/oauth2/authorize?client_id=test", redirect: true });
    };
    await (await freshSession()).signInWithDiscord();
    assert.equal(navigated, "https://discord.com/api/oauth2/authorize?client_id=test");
  });

  await t.test("does not follow unexpected redirect destinations", async () => {
    globalThis.fetch = async () => Response.json({ url: "https://evil.example/oauth2/authorize" });
    await assert.rejects((await freshSession()).signInWithDiscord(), /couldn't be started/);
  });

  await t.test("surfaces unavailable providers and rate limits", async () => {
    const auth = await freshSession();
    globalThis.fetch = async () => Response.json({}, { status: 503 });
    await assert.rejects(auth.signInWithDiscord(), /unavailable/);
    globalThis.fetch = async () => Response.json({}, { status: 429 });
    await assert.rejects(auth.signInWithDiscord(), /Too many attempts/);
  });

  await t.test("session failures can be retried", async () => {
    const auth = await freshSession();
    globalThis.fetch = async () => { throw new Error("offline"); };
    await auth.refreshSession();
    assert.ok(auth.getSessionSnapshot().error);
    globalThis.fetch = async () => Response.json(null);
    await auth.refreshSession();
    assert.equal(auth.getSessionSnapshot().error, "");
  });

  await t.test("only clears the session after server sign-out succeeds", async () => {
    const auth = await freshSession();
    globalThis.fetch = async () => Response.json({ user: { id: "u1", email: "member@example.com" }, session: { id: "s1" } });
    await auth.refreshSession();
    globalThis.fetch = async () => Response.json({}, { status: 500 });
    await assert.rejects(auth.signOut());
    assert.equal(auth.getSessionSnapshot().status, "authenticated");
    globalThis.fetch = async (url, options) => {
      assert.ok(url.endsWith("/api/auth/sign-out"));
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, "include");
      return Response.json({ success: true });
    };
    await auth.signOut();
    assert.equal(auth.getSessionSnapshot().status, "unauthenticated");
  });

  await t.test("keeps an existing session during a temporary API outage", async () => {
    const auth = await freshSession();
    globalThis.fetch = async () => Response.json({ user: { id: "u1", email: "member@example.com" }, session: { id: "s1" } });
    await auth.refreshSession();
    globalThis.fetch = async () => { throw new TypeError("Failed to fetch"); };
    await auth.refreshSession();
    assert.equal(auth.getSessionSnapshot().status, "authenticated");
    assert.match(auth.getSessionSnapshot().error, /couldn't be reached/);
    globalThis.fetch = async () => Response.json(null);
    await auth.refreshSession();
    assert.equal(auth.getSessionSnapshot().status, "unauthenticated");
  });
});
