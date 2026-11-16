import { describe, expect, it } from 'vitest';

import { readConfig } from '../../src/config.js';
import { testConfig } from '../helpers/config.js';

describe('configuration', () => {
  it('reads the environment and converts the port', () => {
    expect(readConfig({ ...testConfig, PORT: '4000' })).toEqual({ ...testConfig, PORT: 4000 });
  });

  it('uses defaults and permits local development without Discord credentials', () => {
    const config = readConfig({ ...testConfig, NODE_ENV: undefined, PORT: undefined,
      DISCORD_CLIENT_ID: undefined, DISCORD_CLIENT_SECRET: undefined });
    expect(config.PORT).toBe(3000);
    expect(config.NODE_ENV).toBe('development');
    expect(config.DISCORD_CLIENT_ID).toBe('');
  });

  it.each([
    ['PORT', '0'], ['PORT', '65536'], ['PORT', 'abc'],
    ['NODE_ENV', 'staging'], ['BETTER_AUTH_SECRET', 'short'],
    ['DATABASE_URL', 'https://localhost/db'], ['DATABASE_URL', 'postgresql://localhost'],
    ['BETTER_AUTH_URL', 'ftp://localhost'], ['CLIENT_ORIGIN', 'https://example.com/path'],
    ['CLIENT_ORIGIN', 'http://localhost:5173/'], ['DISCORD_CLIENT_SECRET', ''],
  ])('rejects invalid %s', (field, value) => {
    expect(() => readConfig({ ...testConfig, PORT: '3000', [field]: value })).toThrow('Invalid environment configuration');
  });

  it('requires HTTPS and Discord credentials in production', () => {
    expect(() => readConfig({ ...testConfig, PORT: '3000', NODE_ENV: 'production',
      DISCORD_CLIENT_ID: '', DISCORD_CLIENT_SECRET: '' })).toThrow('HTTPS is required');
    expect(readConfig({ ...testConfig, PORT: '3000', NODE_ENV: 'production',
      BETTER_AUTH_URL: 'https://api.example.com', CLIENT_ORIGIN: 'https://example.com' }).NODE_ENV).toBe('production');
  });

  it('does not print secrets in validation errors', () => {
    expect(() => readConfig({ ...testConfig, PORT: '3000', BETTER_AUTH_SECRET: 'sensitive' })).toThrow(/BETTER_AUTH_SECRET: Too small/);
    try { readConfig({ BETTER_AUTH_SECRET: 'sensitive' }); } catch (error) {
      expect(String(error)).not.toContain('sensitive');
    }
  });
});
