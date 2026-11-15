import type { Config } from '../../src/config.js';

export const testConfig: Config = {
  NODE_ENV: 'test',
  PORT: 3000,
  BETTER_AUTH_URL: 'http://localhost:3000',
  BETTER_AUTH_SECRET: 'test-secret-1234567890-abcdefghijklmnopqrstuvwxyz',
  CLIENT_ORIGIN: 'http://localhost:5173',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/lumen_radar',
  DISCORD_CLIENT_ID: '123456789012345678',
  DISCORD_CLIENT_SECRET: 'test-discord-secret',
};
