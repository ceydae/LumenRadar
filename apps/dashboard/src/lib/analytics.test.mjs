import assert from "node:assert/strict";
import { test } from "node:test";
import { analyticsPath, readPageviews, trackingSnippet } from "./analytics.ts";
import { workspaceStore } from "./workspace.ts";

const project = {
  id: "89dce2f0-7846-4e5a-bf21-08b85d730def", streamName: "Tracker test",
  websiteUrl: "https://example.com", description: "Stellar payments", mode: "web",
  createdAt: "2026-11-16T00:00:00Z", updatedAt: "2026-11-16T00:00:00Z", umamiWebsiteId: null,
};

test("analytics contract and setup recovery", async (t) => {
  const originalFetch = globalThis.fetch;
  const originalUmamiUrl = process.env.NEXT_PUBLIC_UMAMI_URL;
  t.after(() => {
    globalThis.fetch = originalFetch;
    if (originalUmamiUrl === undefined) delete process.env.NEXT_PUBLIC_UMAMI_URL;
    else process.env.NEXT_PUBLIC_UMAMI_URL = originalUmamiUrl;
  });

  await t.test("all-time omits timestamps; relative ranges use the request's current time", () => {
    assert.equal(analyticsPath(project.id, "all"), `/${project.id}/analytics`);
    for (const [range, days] of [["7d", 7], ["30d", 30]]) {
      const now = 1800000000000;
      const url = new URL(analyticsPath(project.id, range, now), "http://localhost");
      assert.equal(Number(url.searchParams.get("endAt")), now);
      assert.equal(Number(url.searchParams.get("startAt")), now - days * 86400000);
      assert.notEqual(analyticsPath(project.id, range, now), analyticsPath(project.id, range, now + 5000));
    }
  });

  await t.test("failed setup preserves the saved project and retries setup without creating another", async () => {
    const store = workspaceStore("setup-retry");
    const methods = [];
    let failures = 1;
    let websiteId = null;
    globalThis.fetch = async (url, options) => {
      methods.push(`${options.method} ${new URL(url).pathname}`);
      assert.equal(options.credentials, "include");
      if (url.endsWith("/analytics/setup")) {
        if (failures-- > 0) return Response.json({ code: "UMAMI_REQUEST_FAILED", message: "Try setup again." }, { status: 502 });
        websiteId = project.id;
        return Response.json({ websiteId });
      }
      if (options.method === "POST") return Response.json({ project });
      return Response.json({ projects: [{ ...project, umamiWebsiteId: websiteId }] });
    };
    await store.save({ name: project.streamName, websiteUrl: project.websiteUrl, stellarDescription: project.description });
    await assert.rejects(store.setup(project.id), (error) => error.status === 502);
    assert.equal(store.getSnapshot().projects[0].id, project.id);
    assert.equal(store.getSnapshot().projects[0].umamiWebsiteId, null);
    assert.equal(await store.setup(project.id), project.id);
    assert.equal(store.getSnapshot().projects[0].umamiWebsiteId, project.id);
    assert.equal(methods.filter((method) => method === "POST /api/projects").length, 1);
    assert.equal(methods.filter((method) => method.endsWith("/analytics/setup")).length, 2);
    assert.equal(store.getSnapshot().error, "");
  });

  await t.test("reads actual aggregate values for the requested project, including zero", async () => {
    let count = 0;
    globalThis.fetch = async (url, options) => {
      assert.equal(new URL(url).pathname, `/api/projects/${project.id}/analytics`);
      assert.equal(options.credentials, "include");
      assert.equal(options.cache, "no-store");
      return Response.json({ pageviews: count });
    };
    assert.equal(await readPageviews(project.id, "all"), 0);
    count = 17;
    assert.equal(await readPageviews(project.id, "7d"), 17);
    count = -1;
    await assert.rejects(readPageviews(project.id, "all"), /invalid pageview/);
  });

  await t.test("distinguishes setup required from an upstream outage", async () => {
    globalThis.fetch = async () => Response.json({ code: "WEB_ANALYTICS_NOT_CONFIGURED", message: "Set up first." }, { status: 409 });
    await assert.rejects(readPageviews(project.id, "all"), (error) => error.code === "WEB_ANALYTICS_NOT_CONFIGURED");
    globalThis.fetch = async () => Response.json({ code: "UMAMI_REQUEST_FAILED", message: "Please retry." }, { status: 502 });
    await assert.rejects(readPageviews(project.id, "all"), (error) => error.status === 502);
  });

  await t.test("a cancelled project/range read can never provide its late result", async () => {
    const controller = new AbortController();
    globalThis.fetch = async (_url, options) => new Promise((_resolve, reject) => options.signal.addEventListener("abort", () => reject(options.signal.reason)));
    const reading = readPageviews(project.id, "30d", controller.signal);
    controller.abort();
    await assert.rejects(reading, (error) => error.name === "AbortError");
  });

  await t.test("tracking snippet uses the public URL and returned website ID", () => {
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://analytics.example.com/tracker/";
    assert.equal(trackingSnippet(project.id), `<script defer src="https://analytics.example.com/tracker/script.js" data-website-id="${project.id}"></script>`);
    process.env.NEXT_PUBLIC_UMAMI_URL = "https://metrics.example.org";
    assert.equal(trackingSnippet(project.id), `<script defer src="https://metrics.example.org/script.js" data-website-id="${project.id}"></script>`);
  });

  await t.test("missing public URL never falls back to localhost", () => {
    for (const value of [undefined, "", "   "]) {
      if (value === undefined) delete process.env.NEXT_PUBLIC_UMAMI_URL;
      else process.env.NEXT_PUBLIC_UMAMI_URL = value;
      assert.throws(() => trackingSnippet(project.id), /NEXT_PUBLIC_UMAMI_URL must be set/);
    }
  });
});
