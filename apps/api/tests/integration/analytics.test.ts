import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { createApp } from '../../src/app.js';
import { testConfig } from '../helpers/config.js';
import { createTestDatabase } from '../helpers/database.js';
import { signInProjectUser } from '../helpers/signInProjectUser.js';

describe('Project web analytics', () => {
  const apiUrl = 'http://umami.example.test/api';
  const apiKey = 'umami-test-key';
  const range = '?startAt=1704067200000&endAt=1704153600000';
  let database: Awaited<ReturnType<typeof createTestDatabase>>;
  let app: ReturnType<typeof createApp>;
  let owner: ReturnType<typeof request.agent>;
  let other: ReturnType<typeof request.agent>;
  let id: string;
  let path: string;

  beforeAll(async (): Promise<void> => {
    database = await createTestDatabase();
    app = createApp({ ...testConfig, UMAMI_API_URL: apiUrl, UMAMI_API_KEY: apiKey }, database.auth, database.pool);
    owner = await signInProjectUser(app, '100000000000000011');
    other = await signInProjectUser(app, '100000000000000012');
  });

  beforeEach(async (): Promise<void> => {
    const created = await owner.post('/api/projects').send({
      streamName: 'Example site',
      websiteUrl: 'https://example.com/path',
      description: 'We use Stellar for payments.',
      mode: 'web',
    }).expect(201);

    id = created.body.project.id;
    path = `/api/projects/${id}/analytics`;
  });

  afterAll(async (): Promise<void> => {
    await database?.close();
  });

  it('rejects invalid ranges and foreign owners without contacting Umami', async (): Promise<void> => {
    const upstream = vi.spyOn(globalThis, 'fetch');

    await request(app).post(`${path}/setup`).expect(401);
    await other.post(`${path}/setup`).expect(404);
    await other.get(`${path}${range}`).expect(404);
    await owner.get(`${path}?startAt=20&endAt=10`).expect(400);
    await owner.get(`${path}?startAt=10`).expect(400);
    await owner.get(`${path}?endAt=20`).expect(400);
    await owner.get(`${path}${range}`).expect(409);
    await owner.patch(`/api/projects/${id}`).send({ websiteUrl: 'http://127.0.0.1:8080' }).expect(200);
    await owner.post(`${path}/setup`).expect(400);

    expect(upstream).not.toHaveBeenCalled();
  });

  it('keeps the project after failure and safely links the same website on retry', async (): Promise<void> => {
    const upstream = vi.spyOn(globalThis, 'fetch');

    upstream
      .mockRejectedValueOnce(new Error('Timed out after creating the website'))
      .mockResolvedValueOnce(Response.json({}, { status: 400 }))
      .mockResolvedValueOnce(Response.json({ id }));

    await owner.post(`${path}/setup`).expect(502);
    await owner.post(`${path}/setup`).expect(200, { websiteId: id });
    await owner.post(`${path}/setup`).expect(200, { websiteId: id });

    expect(upstream).toHaveBeenCalledTimes(3);

    expect(upstream).toHaveBeenNthCalledWith(2, `${apiUrl}/websites`, expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ id, name: 'Example site', domain: 'example.com' }),
    }));

    expect(upstream).toHaveBeenNthCalledWith(3, `${apiUrl}/websites/${id}`, expect.objectContaining({
      method: 'GET',
    }));

    const project = await owner.get(`/api/projects/${id}`).expect(200);

    expect(project.body.project.umamiWebsiteId).toBe(id);
  });

  it('returns pageviews only and distinguishes an upstream error from zero views', async (): Promise<void> => {
    const upstream = vi.spyOn(globalThis, 'fetch');

    upstream
      .mockResolvedValueOnce(Response.json({ id }))
      .mockResolvedValueOnce(Response.json({ pageviews: 0, visitors: 0 }))
      .mockResolvedValueOnce(Response.json({ pageviews: 3, comparison: { pageviews: 2 } }))
      .mockResolvedValueOnce(Response.json({ pageviews: 8 }))
      .mockResolvedValueOnce(Response.json({}, { status: 401 }));

    await owner.post(`${path}/setup`).expect(200, { websiteId: id });
    await owner.get(`${path}${range}`).expect(200, { pageviews: 0 });
    await owner.get(`${path}${range}`).expect(200, { pageviews: 3 });
    await owner.get(path).expect(200, { pageviews: 8 });
    await owner.get(`${path}${range}`).expect(502);

    expect(upstream).toHaveBeenCalledWith(`${apiUrl}/websites/${id}/stats${range}`, expect.objectContaining({
      method: 'GET',
      headers: expect.objectContaining({ Authorization: `Bearer ${apiKey}` }),
    }));

    expect(upstream).toHaveBeenCalledWith(
      expect.stringMatching(/\/stats\?startAt=1&endAt=\d+$/),
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
