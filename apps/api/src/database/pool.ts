import { Pool } from 'pg';

export function createPool(connectionString: string): Pool {
  const pool = new Pool({
    connectionString,
    max: 10,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 30_000,
    query_timeout: 10_000,
  });
  pool.on('error', (error: Error) => {
    console.error('Idle database connection failed.', error.message);
  });
  return pool;
}
