import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import { createLocalJWKSet, jwtVerify } from 'jose';
import { getMigrations } from 'better-auth/db/migration';
import { createApp } from '../app.js';
import { createAuth, SEVEN_DAYS } from './auth.js';
import { testConfig } from '../test/config.js';
import { createTestDatabase } from '../test/database.js';
import { createPool } from '../database/pool.js';

describe('Discord authentication with PostgreSQL', () => {
  let database: Awaited<ReturnType<typeof createTestDatabase>>;
  let app: ReturnType<typeof createApp>;
  const profile = {
    id: '123456789012345678', username: 'radar', global_name: 'Radar User',
    email: 'radar@example.com', verified: true, avatar: null, discriminator: '0',
  };

  beforeAll(async () => {
    database = await createTestDatabase();
    app = createApp(testConfig, database.auth);
  });
  afterEach(() => { vi.unstubAllGlobals(); });
  afterAll(async () => { await database?.close(); });

  function mockDiscord(options: { tokenStatus?: number; profileStatus?: number; email?: string | null } = {}) {
    return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input) => {
      const url = decodeURIComponent(input instanceof Request ? input.url : String(input));
      if (url === 'https://discord.com/api/oauth2/token') {
        return Response.json(options.tokenStatus ? { error: 'invalid_grant' } : {
          access_token: 'discord-access-token', refresh_token: 'discord-refresh-token',
          token_type: 'Bearer', expires_in: 3600, scope: 'identify email guilds.members.read',
        }, { status: options.tokenStatus ?? 200 });
      }
      if (url === 'https://discord.com/api/users/@me') {
        return Response.json(options.profileStatus ? { message: 'Unauthorized' } : {
          ...profile, email: options.email === undefined ? profile.email : options.email,
        }, { status: options.profileStatus ?? 200 });
      }
      throw new Error(`Unexpected outbound request: ${url}`);
    });
  }

  async function startLogin() {
    const agent = request.agent(app);
    const start = await agent.post('/api/auth/sign-in/social')
      .set('Origin', testConfig.CLIENT_ORIGIN)
      .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN });
    expect(start.status).toBe(200);
    const state = new URL(start.body.url as string).searchParams.get('state');
    expect(state).toBeTruthy();
    return { agent, start, state: state! };
  }

  it('creates the auth and JWT tables, and migrations are repeatable', async () => {
    const result = await database.pool.query<{ table_name: string }>(
      'SELECT table_name FROM information_schema.tables WHERE table_schema = current_schema()',
    );
    expect(result.rows.map((row) => row.table_name)).toEqual(expect.arrayContaining([
      'user', 'account', 'session', 'verification', 'jwks',
    ]));
    const migration = await getMigrations(database.auth.options);
    expect(migration.toBeCreated).toHaveLength(0);
    expect(migration.toBeAdded).toHaveLength(0);
    await migration.runMigrations();
  });

  it('builds a Discord authorization URL with the correct callback and scopes', async () => {
    const { start } = await startLogin();
    const url = new URL(start.body.url as string);
    expect(url.origin).toBe('https://discord.com');
    expect(url.searchParams.get('client_id')).toBe(testConfig.DISCORD_CLIENT_ID);
    expect(url.searchParams.get('redirect_uri')).toBe(`${testConfig.BETTER_AUTH_URL}/api/auth/callback/discord`);
    expect(url.searchParams.get('scope')?.split(' ').sort()).toEqual([
      'email', 'guilds.members.read', 'identify',
    ]);
    expect(start.headers['set-cookie']).toBeDefined();
    expect(start.headers['cache-control']).toBe('no-store');
  });

  it('stores the user and encrypted OAuth tokens, reuses the account, and signs a seven-day JWT', async () => {
    const fetchMock = mockDiscord();
    const { agent, state } = await startLogin();
    const callback = await agent.get('/api/auth/callback/discord').query({ code: 'test-code', state });
    expect(callback.status).toBe(302);
    expect(callback.headers.location).toBe(testConfig.CLIENT_ORIGIN);
    expect(callback.headers['set-cookie']).toEqual(expect.arrayContaining([expect.stringContaining('HttpOnly')]));

    const users = await database.pool.query('SELECT * FROM "user" WHERE email = $1', [profile.email]);
    expect(users.rows).toHaveLength(1);
    expect(users.rows[0]).toMatchObject({ name: profile.global_name, emailVerified: true });
    const accounts = await database.pool.query('SELECT * FROM account WHERE "accountId" = $1', [profile.id]);
    expect(accounts.rows).toHaveLength(1);
    expect(accounts.rows[0].providerId).toBe('discord');
    expect(accounts.rows[0].scope.split(/[ ,]+/).sort()).toEqual([
      'email', 'guilds.members.read', 'identify',
    ]);
    expect(accounts.rows[0].accessToken).not.toBe('discord-access-token');
    expect(accounts.rows[0].refreshToken).not.toBe('discord-refresh-token');
    const sessions = await database.pool.query('SELECT * FROM session WHERE "userId" = $1', [users.rows[0].id]);
    expect((sessions.rows[0].expiresAt.getTime() - sessions.rows[0].createdAt.getTime()) / 1000).toBeCloseTo(SEVEN_DAYS, 0);

    const token = await agent.get('/api/auth/token');
    expect(token.status).toBe(200);
    const keys = await request(app).get('/api/auth/jwks');
    expect(keys.status).toBe(200);
    expect(JSON.stringify(keys.body)).not.toContain('privateKey');
    const { payload } = await jwtVerify(token.body.token as string, createLocalJWKSet(keys.body), {
      issuer: testConfig.BETTER_AUTH_URL, audience: 'lumen-radar',
    });
    expect(payload.sub).toBe(users.rows[0].id);
    expect(payload.exp! - payload.iat!).toBe(SEVEN_DAYS);
    expect(payload).not.toHaveProperty('email');
    await expect(jwtVerify(token.body.token as string, createLocalJWKSet(keys.body), {
      currentDate: new Date(payload.exp! * 1000 + 1000),
    })).rejects.toThrow('"exp" claim timestamp check failed');
    const session = await agent.get('/api/auth/get-session');
    expect(session.body.user.id).toBe(users.rows[0].id);
    expect(session.headers['set-auth-jwt']).toBeTruthy();

    const repeat = await startLogin();
    await repeat.agent.get('/api/auth/callback/discord').query({ code: 'new-code', state: repeat.state }).expect(302);
    expect((await database.pool.query('SELECT * FROM "user" WHERE email = $1', [profile.email])).rowCount).toBe(1);
    expect((await database.pool.query('SELECT * FROM account WHERE "accountId" = $1', [profile.id])).rowCount).toBe(1);

    await agent.post('/api/auth/sign-out').set('Origin', testConfig.CLIENT_ORIGIN).send({}).expect(200);
    await agent.get('/api/auth/token').expect(401);
    expect((await agent.get('/api/auth/get-session')).body).toBeNull();
    expect(fetchMock).toHaveBeenCalledTimes(4);
  });

  it('does not issue a JWT without a session', async () => {
    await request(app).get('/api/auth/token').expect(401);
    expect((await request(app).get('/api/auth/get-session')).body).toBeNull();
  });

  it('rejects missing providers and malformed JSON', async () => {
    await request(app).post('/api/auth/sign-in/social').send({}).expect(400);
    await request(app).post('/api/auth/sign-in/social').set('Content-Type', 'application/json').send('{').expect(400);
  });

  it('rejects other providers and untrusted callback URLs', async () => {
    await request(app).post('/api/auth/sign-in/social').send({ provider: 'google' }).expect(404);
    await request(app).post('/api/auth/sign-in/social')
      .send({ provider: 'discord', callbackURL: 'https://evil.example.com' }).expect(403);
  });

  it('rejects requests with cookies from untrusted origins', async () => {
    await request(app).post('/api/auth/sign-in/social').set('Origin', 'https://evil.example.com')
      .set('Cookie', 'better-auth.session_token=invalid')
      .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN }).expect(403);
  });

  it('returns a clear error while Discord credentials are missing', async () => {
    const config = { ...testConfig, DISCORD_CLIENT_ID: '', DISCORD_CLIENT_SECRET: '' };
    const localApp = createApp(config, createAuth(config, database.pool));
    const result = await request(localApp).post('/api/auth/sign-in/social').send({ provider: 'discord' });
    expect(result.status).toBe(503);
    expect(result.body.code).toBe('DISCORD_NOT_CONFIGURED');
  });

  it('rejects callbacks without a state', async () => {
    const result = await request(app).get('/api/auth/callback/discord').query({ code: 'test-code' });
    expect(result.status).toBe(302);
    expect(result.headers.location).toContain('error=state_not_found');
  });

  it('rejects a callback from another browser', async () => {
    const { state } = await startLogin();
    const result = await request(app).get('/api/auth/callback/discord').query({ code: 'test-code', state });
    expect(result.status).toBe(302);
    expect(result.headers.location).toContain('error=');
    expect(result.headers['set-cookie'] ?? []).not.toEqual(expect.arrayContaining([expect.stringContaining('session_token=')]));
  });

  it.each([
    { tokenStatus: 400 }, { profileStatus: 401 }, { email: null },
  ])('handles Discord failure %j without creating a session', async (options) => {
    mockDiscord(options);
    const { agent, state } = await startLogin();
    const result = await agent.get('/api/auth/callback/discord').query({ code: 'test-code', state });
    expect(result.status).toBe(302);
    expect(result.headers.location).toContain('error=');
    await agent.get('/api/auth/token').expect(401);
  });

  it('handles a denied Discord authorization', async () => {
    const { agent, state } = await startLogin();
    const result = await agent.get('/api/auth/callback/discord').query({ error: 'access_denied', state });
    expect(result.status).toBe(302);
    expect(result.headers.location).toContain('error=access_denied');
  });

  it('serves Swagger and handles unknown routes', async () => {
    const docs = await request(app).get('/docs/');
    expect(docs.status).toBe(200);
    expect(docs.text).toContain('Lumen Radar API');
    expect(docs.headers['x-powered-by']).toBeUndefined();
    const spec = await request(app).get('/openapi.json').expect(200);
    expect(spec.body.info.title).toBe('Lumen Radar API');
    await request(app).get('/missing').expect(404, { code: 'NOT_FOUND', message: 'Route not found.' });
    await request(app).post('/api/auth/sign-up/email').send({}).expect(404);
    await request(app).get('/api/auth/callback/google').expect(404);
  });

  it('allows the frontend to use session cookies through CORS', async () => {
    const response = await request(app).options('/api/auth/sign-in/social')
      .set('Origin', testConfig.CLIENT_ORIGIN).set('Access-Control-Request-Method', 'POST');
    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-origin']).toBe(testConfig.CLIENT_ORIGIN);
    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('handles a database failure without leaking its details', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const pool = createPool('postgresql://postgres:postgres@127.0.0.1:1/missing');
    try {
      const brokenApp = createApp(testConfig, createAuth(testConfig, pool));
      const result = await request(brokenApp).get('/api/auth/jwks');
      expect(result.status).toBe(500);
      expect(result.body).toEqual({ code: 'INTERNAL_ERROR', message: 'Something went wrong. Try again.' });
    } finally {
      await pool.end();
    }
  });

  it('rate limits repeated login attempts', async () => {
    const limited = createApp(testConfig, createAuth(testConfig, database.pool));
    for (let attempt = 0; attempt < 3; attempt++) {
      await request(limited).post('/api/auth/sign-in/social')
        .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN }).expect(200);
    }
    const result = await request(limited).post('/api/auth/sign-in/social')
      .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN });
    expect(result.status).toBe(429);
    expect(result.headers['x-retry-after']).toBeDefined();
  });
});
