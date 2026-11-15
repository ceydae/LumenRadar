import { randomUUID } from 'node:crypto';
import { getMigrations } from 'better-auth/db/migration';

import { testConfig } from './config.js';
import { createAuth } from '../../src/auth/auth.js';
import { createPool } from '../../src/database/pool.js';
import { closeTestDatabase } from './closeTestDatabase.js';
import type { TestDatabase } from '../../src/types/tests/testDatabase.js';
import { migrateProjects } from '../../src/database/migrations/migrateProjects.js';

export const createTestDatabase = async (): Promise<TestDatabase> => {
  const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error('Set TEST_DATABASE_URL or DATABASE_URL to run PostgreSQL tests.');
  }

  const schema = `test_${randomUUID().replaceAll('-', '')}`;
  const admin = createPool(connectionString);

  await admin.query(`CREATE SCHEMA "${schema}"`);

  const url = new URL(connectionString);

  url.searchParams.set('options', `-c search_path=${schema}`);

  const pool = createPool(url.toString());
  const close = closeTestDatabase.bind(null, admin, pool, schema);

  try {
    const auth = createAuth(testConfig, pool);

    (await auth.$context).rateLimit.enabled = false;

    const { runMigrations } = await getMigrations(auth.options);

    await runMigrations();
    await migrateProjects(pool);

    return { pool, auth, close };
  } catch (error) {
    await close();

    throw error;
  }
};
