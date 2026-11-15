import request from 'supertest';
import { vi, expect } from 'vitest';
import type { Express } from 'express';

import { testConfig } from './config.js';

export const signInProjectUser = async (
  app: Express,
  accountId: string,
): Promise<ReturnType<typeof request.agent>> => {
  vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: Parameters<typeof fetch>[0]): Promise<Response> => {
    const url = decodeURIComponent(input instanceof Request ? input.url : String(input));

    if (url === 'https://discord.com/api/oauth2/token') {
      return Response.json({ access_token: 'test-access-token', token_type: 'Bearer', expires_in: 3600, scope: 'identify email' });
    }

    if (url === 'https://discord.com/api/users/@me') {
      return Response.json({ id: accountId, username: 'example', email: `${accountId}@example.com`, verified: true, avatar: null, discriminator: '0' });
    }

    throw new Error('Unexpected outbound request.');
  });

  const agent = request.agent(app);

  const start = await agent.post('/api/auth/sign-in/social')
    .set('Origin', testConfig.CLIENT_ORIGIN)
    .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN });

  expect(start.status).toBe(200);

  const state = new URL(start.body.url as string).searchParams.get('state');

  await agent.get('/api/auth/callback/discord').query({ code: 'test-code', state }).expect(302);
  await agent.get('/api/auth/get-session').expect(200);

  return agent;
};
