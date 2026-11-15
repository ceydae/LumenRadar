import { getMigrations } from 'better-auth/db/migration';
import { createAuth } from '../auth/auth.js';
import { readConfig } from '../config.js';
import { createPool } from './pool.js';

try {
  const config = readConfig();
  const database = createPool(config.DATABASE_URL);
  try {
    const auth = createAuth(config, database);
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
    console.info('Database is up to date.');
  } finally {
    await database.end();
  }
} catch (error) {
  console.error('Database migration failed.', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
}
