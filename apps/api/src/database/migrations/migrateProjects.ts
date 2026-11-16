import type { Pool } from 'pg';

export const migrateProjects = async (database: Pool): Promise<void> => {
  await database.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id UUID PRIMARY KEY,
      owner_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      stream_name VARCHAR(100) NOT NULL CHECK (length(trim(stream_name)) > 0),
      website_url VARCHAR(2048) NOT NULL,
      mode TEXT NOT NULL CHECK (mode IN ('web', 'api', 'both')),
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS projects_owner_id_idx ON projects (owner_id);
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS description VARCHAR(200) NOT NULL DEFAULT '';
    ALTER TABLE projects ADD COLUMN IF NOT EXISTS umami_website_id UUID;
  `);
};
