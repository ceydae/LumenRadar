import assert from "node:assert/strict";
import { test } from "node:test";

const apiProject = {
  id: "89dce2f0-7846-4e5a-bf21-08b85d730def",
  streamName: "Orbit",
  websiteUrl: "https://orbit.example",
  description: "Stellar payments",
  mode: "web",
  createdAt: "2026-11-16T00:00:00.000Z",
  updatedAt: "2026-11-16T00:00:00.000Z",
  umamiWebsiteId: null,
};
const details = { name: " Orbit ", websiteUrl: "https://orbit.example", stellarDescription: "Stellar payments" };

test("frontend project API contract", async (t) => {
  const originalFetch = globalThis.fetch;
  t.after(() => { globalThis.fetch = originalFetch; });
  const { workspaceStore, saveProject } = await import("./workspace.ts");

  await t.test("unwraps project lists and maps API fields for the interface", async () => {
    globalThis.fetch = async (url, options) => {
      assert.ok(url.endsWith("/api/projects"));
      assert.equal(options.method, "GET");
      assert.equal(options.credentials, "include");
      return Response.json({ projects: [apiProject] });
    };
    const store = workspaceStore("list-contract");
    await store.load();
    assert.equal(store.getSnapshot().error, "");
    assert.equal(store.getSnapshot().projects[0].name, "Orbit");
    assert.equal(store.getSnapshot().projects[0].stellarDescription, apiProject.description);
    assert.equal(store.getSnapshot().projects[0].connectionMode, "web");
  });

  await t.test("creates with all required fields and unwraps the response", async () => {
    let calls = 0;
    globalThis.fetch = async (url, options) => {
      calls++;
      if (options.method === "GET") return Response.json({ projects: [apiProject] });
      assert.ok(url.endsWith("/api/projects"));
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, "include");
      assert.deepEqual(JSON.parse(options.body), {
        streamName: "Orbit", websiteUrl: details.websiteUrl, description: details.stellarDescription, mode: "web",
      });
      return Response.json({ project: apiProject }, { status: 201 });
    };
    const project = await saveProject("create-contract", details);
    assert.equal(calls, 2);
    assert.equal(project.id, apiProject.id);
    assert.equal(project.connectionMode, "web");
    assert.equal(workspaceStore("create-contract").getSnapshot().projects.length, 1);
  });

  await t.test("updates by UUID using the API field names", async () => {
    globalThis.fetch = async (url, options) => {
      if (options.method === "GET") return Response.json({ projects: [apiProject] });
      assert.ok(url.endsWith(`/api/projects/${apiProject.id}`));
      assert.equal(options.method, "PATCH");
      assert.equal(JSON.parse(options.body).streamName, "Orbit");
      return Response.json({ project: apiProject });
    };
    await saveProject("update-contract", details, apiProject.id);
  });

  await t.test("keeps a rejected project out of the list and surfaces the API limit error", async () => {
    globalThis.fetch = async () => Response.json({ code: "PROJECT_LIMIT_REACHED", message: "You can have up to 5 projects." }, { status: 409 });
    await assert.rejects(saveProject("limit-contract", details), /up to 5 projects/);
    assert.equal(workspaceStore("limit-contract").getSnapshot().projects.length, 0);
  });

  await t.test("clears the workspace when a list request finds an expired session", async () => {
    globalThis.fetch = async () => Response.json({ message: "Sign in with Discord first." }, { status: 401 });
    const store = workspaceStore("expired-contract");
    await store.load();
    assert.equal(store.getSnapshot().loaded, false);
    assert.deepEqual(store.getSnapshot().projects, []);
    const auth = await import("./session.ts");
    assert.equal(auth.getSessionSnapshot().status, "unauthenticated");
  });

  await t.test("accepts 200 description characters and rejects 201 before sending", async () => {
    let calls = 0;
    globalThis.fetch = async (_url, options) => {
      if (options.method === "GET") return Response.json({ projects: [apiProject] });
      calls++; return Response.json({ project: apiProject });
    };
    await saveProject("description-contract", { ...details, stellarDescription: "x".repeat(200) });
    await assert.rejects(saveProject("description-contract", { ...details, stellarDescription: "x".repeat(201) }), /200 characters/);
    assert.equal(calls, 1);
  });

  await t.test("reads project details by the returned UUID with the session cookie", async () => {
    globalThis.fetch = async (url, options) => {
      assert.ok(url.endsWith(`/api/projects/${apiProject.id}`));
      assert.equal(options.method, "GET");
      assert.equal(options.credentials, "include");
      return Response.json({ project: apiProject });
    };
    const project = await workspaceStore("detail-contract").detail(apiProject.id);
    assert.equal(project.id, apiProject.id);
    assert.equal(project.stellarDescription, apiProject.description);
  });

  await t.test("deletes with no body and handles the API's empty 204 response", async () => {
    const store = workspaceStore("delete-contract");
    globalThis.fetch = async () => Response.json({ projects: [apiProject] });
    await store.load();
    globalThis.fetch = async (url, options) => {
      if (options.method === "GET") return Response.json({ projects: [] });
      assert.ok(url.endsWith(`/api/projects/${apiProject.id}`));
      assert.equal(options.method, "DELETE");
      assert.equal(options.credentials, "include");
      assert.equal(options.body, undefined);
      return new Response(null, { status: 204 });
    };
    await store.remove(apiProject.id);
    assert.deepEqual(store.getSnapshot().projects, []);
  });

  await t.test("a failed deletion keeps the project and retains the error contract", async () => {
    const store = workspaceStore("delete-failure");
    globalThis.fetch = async () => Response.json({ projects: [apiProject] });
    await store.load();
    globalThis.fetch = async () => Response.json({ code: "UNTRUSTED_ORIGIN", message: "Untrusted request origin." }, { status: 403 });
    await assert.rejects(store.remove(apiProject.id), (error) => error.status === 403 && error.code === "UNTRUSTED_ORIGIN");
    assert.equal(store.getSnapshot().projects.length, 1);
  });

  await t.test("a late list response cannot restore a deleted project", async () => {
    const store = workspaceStore("delete-race");
    let resolveList;
    globalThis.fetch = async () => new Promise((resolve) => { resolveList = resolve; });
    const loading = store.load();
    globalThis.fetch = async (_url, options) => options.method === "GET" ? Response.json({ projects: [] }) : new Response(null, { status: 204 });
    await store.remove(apiProject.id);
    resolveList(Response.json({ projects: [apiProject] }));
    await loading;
    assert.deepEqual(store.getSnapshot().projects, []);
  });

  await t.test("a project 401 expires the session and clears cached account data", async () => {
    const auth = await import("./session.ts");
    globalThis.fetch = async () => Response.json({ user: { id: "expired-user", email: "member@example.com" }, session: { id: "s1" } });
    await auth.refreshSession();
    const store = workspaceStore("expired-user");
    globalThis.fetch = async () => Response.json({ projects: [apiProject] });
    await store.load();
    globalThis.fetch = async () => Response.json({ code: "UNAUTHORIZED", message: "Sign in with Discord first." }, { status: 401 });
    await assert.rejects(store.detail(apiProject.id), (error) => error.status === 401 && error.code === "UNAUTHORIZED");
    assert.equal(auth.getSessionSnapshot().status, "unauthenticated");
    assert.deepEqual(store.getSnapshot().projects, []);
  });

  await t.test("logout discards an in-flight list response", async () => {
    const auth = await import("./session.ts");
    const store = workspaceStore("logout-race");
    let resolveList;
    globalThis.fetch = async () => new Promise((resolve) => { resolveList = resolve; });
    const loading = store.load();
    globalThis.fetch = async () => Response.json({ success: true });
    await auth.signOut();
    resolveList(Response.json({ projects: [apiProject] }));
    await loading;
    assert.deepEqual(store.getSnapshot().projects, []);
    assert.equal(store.getSnapshot().loaded, false);
  });
});
