import { createApp } from './app.js';
import { readConfig } from './config.js';
import { startServer } from './startup.js';
import { createAuth } from './auth/auth.js';
import { createPool } from './database/pool.js';

try {
  const config = readConfig();
  const database = createPool(config.DATABASE_URL);

  await startServer(
    createApp(config, createAuth(config, database), database),
    database,
    config.PORT,
  );
} catch (error) {
  console.error(
    'Could not start Lumen Radar API.',
    error instanceof Error ? error.message : 'Unknown error',
  );
  process.exitCode = 1;
}
