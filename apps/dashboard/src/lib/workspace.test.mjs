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
      assert.ok(url.endsWith("/api/projects"));
      assert.equal(options.method, "POST");
      assert.equal(options.credentials, "include");
      assert.deepEqual(JSON.parse(options.body), {
        streamName: "Orbit", websiteUrl: details.websiteUrl, description: details.stellarDescription, mode: "web",
      });
      return Response.json({ project: apiProject }, { status: 201 });
    };
    const project = await saveProject("create-contract", details);
    assert.equal(calls, 1);
    assert.equal(project.id, apiProject.id);
    assert.equal(project.connectionMode, "web");
    assert.equal(workspaceStore("create-contract").getSnapshot().projects.length, 1);
  });

  await t.test("updates by UUID using the API field names", async () => {
    globalThis.fetch = async (url, options) => {
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

  await t.test("handles an unauthenticated list response as a load error", async () => {
    globalThis.fetch = async () => Response.json({ message: "Sign in with Discord first." }, { status: 401 });
    const store = workspaceStore("expired-contract");
    await store.load();
    assert.equal(store.getSnapshot().loaded, true);
    assert.equal(store.getSnapshot().error, "Sign in with Discord first.");
  });

  await t.test("accepts 200 description characters and rejects 201 before sending", async () => {
    let calls = 0;
    globalThis.fetch = async () => { calls++; return Response.json({ project: apiProject }); };
    await saveProject("description-contract", { ...details, stellarDescription: "x".repeat(200) });
    await assert.rejects(saveProject("description-contract", { ...details, stellarDescription: "x".repeat(201) }), /200 characters/);
    assert.equal(calls, 1);
  });
});
