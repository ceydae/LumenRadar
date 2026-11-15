import request from 'supertest';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';

import { createApp } from '../../src/app.js';
import { testConfig } from '../helpers/config.js';
import { createTestDatabase } from '../helpers/database.js';
import { signInProjectUser } from '../helpers/signInProjectUser.js';
import { migrateProjects } from '../../src/database/migrations/migrateProjects.js';

describe('Project CRUD with Discord sessions and PostgreSQL', () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;
  let app: ReturnType<typeof createApp>;
  let owner: ReturnType<typeof request.agent>;
  let other: ReturnType<typeof request.agent>;

  const input = {
    streamName: 'Example site',
    websiteUrl: 'https://example.com',
    description: 'We use Stellar to settle payments.',
    mode: 'web',
  };

  beforeAll(async () => {
    database = await createTestDatabase();
    app = createApp(testConfig, database.auth, database.pool);
    owner = await signInProjectUser(app, '100000000000000001');
    other = await signInProjectUser(app, '100000000000000002');
  });

  beforeEach(async () => {
    await database.pool.query('DELETE FROM projects');
  });

  afterAll(async () => {
    await database?.close();
  });

  it('requires a valid session for every route', async () => {
    const id = randomUUID();

    await request(app).get('/api/projects').expect(401);
    await request(app).post('/api/projects').send(input).expect(401);
    await request(app).get(`/api/projects/${id}`).expect(401);
    await request(app).patch(`/api/projects/${id}`).send({ streamName: 'Updated' }).expect(401);
    await request(app).delete(`/api/projects/${id}`).expect(401);
    await request(app).get('/api/projects').set('Cookie', 'better-auth.session_token=invalid').expect(401);
  });

  it('persists, lists, reads, updates and deletes an owned project', async () => {
    const empty = await owner.get('/api/projects').expect(200);

    expect(empty.body).toEqual({ projects: [] });

    const created = await owner.post('/api/projects').send({ ...input, streamName: '  Example site  ' }).expect(201);
    const project = created.body.project;

    expect(project).toMatchObject(input);
    expect(project.id).toMatch(/^[0-9a-f-]{36}$/);
    expect(project.createdAt).toBeTruthy();
    expect(created.headers.location).toBe(`/api/projects/${project.id}`);
    expect(created.headers['cache-control']).toBe('no-store');

    const stored = await database.pool.query('SELECT owner_id FROM projects WHERE id = $1', [project.id]);
    const session = await owner.get('/api/auth/get-session');

    expect(stored.rows[0].owner_id).toBe(session.body.user.id);

    const listed = await owner.get('/api/projects').expect(200);

    expect(listed.body.projects).toEqual([project]);

    await owner.get(`/api/projects/${project.id}`).expect(200, { project });

    const updated = await owner.patch(`/api/projects/${project.id}`).send({ streamName: 'Updated site' }).expect(200);

    expect(updated.body.project).toMatchObject({ id: project.id, streamName: 'Updated site', websiteUrl: input.websiteUrl, description: input.description, mode: 'web', createdAt: project.createdAt });

    const changedUrl = await owner.patch(`/api/projects/${project.id}`).send({ websiteUrl: 'http://localhost:8080/docs', mode: 'web' }).expect(200);

    expect(changedUrl.body.project.websiteUrl).toBe('http://localhost:8080/docs');

    await owner.delete(`/api/projects/${project.id}`).expect(204);
    await owner.get(`/api/projects/${project.id}`).expect(404);

    expect((await database.pool.query('SELECT id FROM projects')).rowCount).toBe(0);
  });

  it('isolates projects between users for reads, updates and deletes', async () => {
    const created = await owner.post('/api/projects').send(input).expect(201);
    const id = created.body.project.id;
    const listed = await other.get('/api/projects').expect(200);

    expect(listed.body.projects).toEqual([]);

    await other.get(`/api/projects/${id}`).expect(404);
    await other.patch(`/api/projects/${id}`).send({ streamName: 'Changed by another user' }).expect(404);
    await other.delete(`/api/projects/${id}`).expect(404);
    await owner.get(`/api/projects/${id}`).expect(200, created.body);
  });

  it('enforces 5 slots under concurrent creation, independently per user, and frees deleted slots', async () => {
    const results = await Promise.all(Array.from({ length: 8 }, () => owner.post('/api/projects').send(input)));

    expect(results.filter((result) => result.status === 201)).toHaveLength(5);
    expect(results.filter((result) => result.status === 409)).toHaveLength(3);
    expect(results.find((result) => result.status === 409)?.body.code).toBe('PROJECT_LIMIT_REACHED');

    const listed = await owner.get('/api/projects').expect(200);

    expect(listed.body.projects).toHaveLength(5);

    await other.post('/api/projects').send(input).expect(201);
    await owner.delete(`/api/projects/${listed.body.projects[0].id}`).expect(204);
    await owner.post('/api/projects').send(input).expect(201);
    await owner.post('/api/projects').send(input).expect(409);
  });

  it.each([
    {},
    { ...input, streamName: '   ' },
    { ...input, streamName: 'a'.repeat(101) },
    { ...input, websiteUrl: 'not-a-url' },
    { ...input, websiteUrl: 'javascript:alert(1)' },
    { ...input, websiteUrl: 'ftp://example.com' },
    { ...input, websiteUrl: `https://example.com/${'a'.repeat(2048)}` },
    { ...input, mode: 'api' },
    { ...input, mode: 'both' },
    { ...input, mode: 'unknown' },
    { ...input, ownerId: 'another-user' },
    { ...input, streamName: null },
    { ...input, description: undefined },
    { ...input, description: null },
    { ...input, description: '   ' },
    { ...input, description: 'a'.repeat(201) },
  ])('rejects invalid creation input: %j', async (body) => {
    await owner.post('/api/projects').send(body).expect(400);
  });

  it('rejects empty or invalid patches without modifying the project', async () => {
    const created = await owner.post('/api/projects').send(input).expect(201);
    const path = `/api/projects/${created.body.project.id}`;

    await owner.patch(path).send({}).expect(400);
    await owner.patch(path).send({ mode: 'api' }).expect(400);
    await owner.patch(path).send({ mode: 'both' }).expect(400);
    await owner.patch(path).send({ ownerId: 'another-user' }).expect(400);
    await owner.patch(path).send({ websiteUrl: null }).expect(400);
    await owner.patch(path).send({ description: null }).expect(400);
    await owner.patch(path).send({ description: ' ' }).expect(400);
    await owner.patch(path).send({ description: 'a'.repeat(201) }).expect(400);
    await owner.get(path).expect(200, created.body);
  });

  it('returns 400 for invalid IDs and 404 for missing projects', async () => {
    const path = `/api/projects/${randomUUID()}`;

    await owner.get('/api/projects/invalid').expect(400);
    await owner.patch('/api/projects/invalid').send({ streamName: 'Updated' }).expect(400);
    await owner.delete('/api/projects/invalid').expect(400);
    await owner.get(path).expect(404);
    await owner.patch(path).send({ streamName: 'Updated' }).expect(404);
    await owner.delete(path).expect(404);
  });

  it('rejects foreign origins, malformed JSON and oversized bodies', async () => {
    await owner.post('/api/projects').set('Origin', 'https://other.example.com').send(input).expect(403);
    await owner.post('/api/projects').set('Sec-Fetch-Site', 'cross-site').send(input).expect(403);
    await owner.post('/api/projects').set('Content-Type', 'application/json').send('{').expect(400);
    await owner.post('/api/projects').send({ ...input, streamName: 'a'.repeat(20_000) }).expect(413);
    await owner.post('/api/projects').set('Origin', testConfig.CLIENT_ORIGIN).send(input).expect(201);
    await owner.post('/api/projects').set('Origin', testConfig.BETTER_AUTH_URL).send(input).expect(201);
  });

  it('does not accept expired sessions or signed-out sessions', async () => {
    const agent = await signInProjectUser(app, '100000000000000003');
    const session = await agent.get('/api/auth/get-session');

    await database.pool.query('UPDATE session SET "expiresAt" = now() - interval \'1 day\' WHERE "userId" = $1', [session.body.user.id]);
    await agent.get('/api/projects').expect(401);

    const signedOut = await signInProjectUser(app, '100000000000000004');

    await signedOut.post('/api/auth/sign-out').set('Origin', testConfig.CLIENT_ORIGIN).send({}).expect(200);
    await signedOut.get('/api/projects').expect(401);
  });

  it('can apply the project migration repeatedly without losing records', async () => {
    const created = await owner.post('/api/projects').send(input).expect(201);

    await migrateProjects(database.pool);
    await migrateProjects(database.pool);
    await owner.get(`/api/projects/${created.body.project.id}`).expect(200, created.body);
  });

  it('accepts 200 description characters, trims input and persists edits in detail and list responses', async () => {
    const description = 'a'.repeat(200);

    const created = await owner.post('/api/projects')
      .send({ ...input, description: `  ${description}  ` })
      .expect(201);

    const path = `/api/projects/${created.body.project.id}`;

    expect(created.body.project.description).toBe(description);

    const read = await owner.get(path).expect(200);

    expect(read.body.project.description).toBe(description);

    const updated = await owner.patch(path).send({ description: '  We build payment tools on Stellar.  ' }).expect(200);

    expect(updated.body.project.description).toBe('We build payment tools on Stellar.');

    const listed = await owner.get('/api/projects').expect(200);
    const stored = await database.pool.query('SELECT description FROM projects WHERE id = $1', [created.body.project.id]);

    expect(listed.body.projects[0].description).toBe(updated.body.project.description);
    expect(stored.rows[0].description).toBe(updated.body.project.description);

    await owner.get(path).expect(200, updated.body);
    await owner.patch(path).send({ description }).expect(200);

    await expect(database.pool.query('UPDATE projects SET description = $1 WHERE id = $2', ['a'.repeat(201), created.body.project.id]))
      .rejects.toMatchObject({ code: '22001' });
  });

  it('upgrades existing project tables without losing projects or requiring an invented description', async () => {
    const created = await owner.post('/api/projects').send(input).expect(201);
    const path = `/api/projects/${created.body.project.id}`;

    await database.pool.query('ALTER TABLE projects DROP COLUMN description');
    await migrateProjects(database.pool);

    const restored = await owner.get(path).expect(200);

    expect(restored.body.project).toEqual({ ...created.body.project, description: '' });

    await owner.patch(path).send({ description: input.description }).expect(200);
    await migrateProjects(database.pool);

    const updated = await owner.get(path).expect(200);

    expect(updated.body.project.description).toBe(input.description);
  });
});
