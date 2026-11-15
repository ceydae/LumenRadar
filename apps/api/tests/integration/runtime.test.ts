import { promisify } from 'node:util';
import { execFile } from 'node:child_process';
import { describe, expect, it } from 'vitest';

import { testConfig } from '../helpers/config.js';

const run = promisify(execFile);

describe('command failures', () => {
  it.each(['src/server.ts', 'src/database/migrate.ts'])('%s exits cleanly on invalid configuration', async (file) => {
    await expect(run(process.execPath, ['--import=tsx', file], {
      env: { ...process.env, ...testConfig, PORT: 'invalid', BETTER_AUTH_SECRET: 'private' },
    })).rejects.toMatchObject({ code: 1, stderr: expect.stringContaining('Invalid environment configuration') });
  });

  it.each(['src/server.ts', 'src/database/migrate.ts'])('%s exits when PostgreSQL is unavailable', async (file) => {
    await expect(run(process.execPath, ['--import=tsx', file], {
      env: { ...process.env, ...testConfig, PORT: '3000', DATABASE_URL: 'postgresql://postgres:postgres@127.0.0.1:1/missing' },
    })).rejects.toMatchObject({ code: 1, stderr: expect.stringMatching(/(Could not start|migration failed)/) });
  });
});
