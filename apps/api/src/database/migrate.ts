import { getMigrations } from 'better-auth/db/migration';

import { createPool } from './pool.js';
import { readConfig } from '../config.js';
import { createAuth } from '../auth/auth.js';
import { migrateProjects } from './migrations/migrateProjects.js';

try {
  const config = readConfig();
  const database = createPool(config.DATABASE_URL);
  try {
    const auth = createAuth(config, database);
    const { runMigrations } = await getMigrations(auth.options);
    await runMigrations();
    await migrateProjects(database);
    console.info('Database is up to date.');
  } finally {
    await database.end();
  }
} catch (error) {
  console.error('Database migration failed.', error instanceof Error ? error.message : 'Unknown error');
  process.exitCode = 1;
}
