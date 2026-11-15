import { randomUUID } from 'node:crypto';
import { getMigrations } from 'better-auth/db/migration';
import { createAuth } from '../auth/auth.js';
import { createPool } from '../database/pool.js';
import { testConfig } from './config.js';

export async function createTestDatabase() {
  const connectionString = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL;
  if (!connectionString) throw new Error('Set TEST_DATABASE_URL or DATABASE_URL to run PostgreSQL tests.');

  const schema = `test_${randomUUID().replaceAll('-', '')}`;
  const admin = createPool(connectionString);
  await admin.query(`CREATE SCHEMA "${schema}"`);
  const url = new URL(connectionString);
  url.searchParams.set('options', `-c search_path=${schema}`);
  const pool = createPool(url.toString());

  const close = async () => {
    await pool.end();
    try {
      await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
    } finally {
      await admin.end();
    }
  };

  try {
    const auth = createAuth(testConfig, pool);
    (await auth.$context).rateLimit.enabled = false;
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
    return { pool, auth, close };
  } catch (error) {
    await close();
    throw error;
  }
}
