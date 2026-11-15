import { once } from 'node:events';
import type { Express } from 'express';
import type { Pool } from 'pg';

export async function startServer(app: Express, database: Pool, port: number) {
  try {
    await database.query('SELECT 1');
    const server = app.listen(port);
    await once(server, 'listening');
    console.info(`Lumen Radar API listening on port ${port}.`);

    let stopping = false;
    const shutdown = () => {
      if (stopping) return;
      stopping = true;
      const timeout = setTimeout(() => {
        console.error('Shutdown timed out.');
        process.exit(1);
      }, 10_000);
      timeout.unref();
      server.close((error) => {
        void database.end().then(() => {
          clearTimeout(timeout);
          if (error) {
            console.error('HTTP server shutdown failed.', error.message);
            process.exitCode = 1;
          }
        }).catch((closeError: unknown) => {
          console.error('Database shutdown failed.', closeError instanceof Error ? closeError.message : 'Unknown error');
          process.exitCode = 1;
          clearTimeout(timeout);
        });
      });
    };
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
    return server;
  } catch (error) {
    await database.end();
    throw error;
  }
}
