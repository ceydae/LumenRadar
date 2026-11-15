import type { Pool } from 'pg';

export const closeTestDatabase = async (admin: Pool, pool: Pool, schema: string): Promise<void> => {
  await pool.end();

  try {
    await admin.query(`DROP SCHEMA "${schema}" CASCADE`);
  } finally {
    await admin.end();
  }
};
