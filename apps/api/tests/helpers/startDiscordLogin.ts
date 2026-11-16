import request from 'supertest';
import { expect } from 'vitest';
import type { Express } from 'express';

import { testConfig } from './config.js';
import type { DiscordLogin } from '../../src/types/tests/discordLogin.js';

export const startLogin = async (app: Express): Promise<DiscordLogin> => {
  const agent = request.agent(app);

  const start = await agent.post('/api/auth/sign-in/social')
    .set('Origin', testConfig.CLIENT_ORIGIN)
    .send({ provider: 'discord', callbackURL: testConfig.CLIENT_ORIGIN });

  expect(start.status).toBe(200);

  const state = new URL(start.body.url as string).searchParams.get('state');

  expect(state).toBeTruthy();

  return { agent, start, state: state! };
};
