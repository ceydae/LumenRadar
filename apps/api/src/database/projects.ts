import type { Pool } from 'pg';
import { randomUUID } from 'node:crypto';

import type { Project } from '../types/projects/project.js';
import type { ProjectInput } from '../types/projects/projectInput.js';

const projectColumns = `
  id,
  stream_name AS "streamName",
  website_url AS "websiteUrl",
  description,
  mode,
  umami_website_id AS "umamiWebsiteId",
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

export const selectProjects = async (
  database: Pool,
  userId: string,
): Promise<Project[]> => {
  const result = await database.query<Project>(
    `SELECT ${projectColumns} FROM projects WHERE owner_id = $1 ORDER BY created_at DESC, id`,
    [userId],
  );

  return result.rows;
};

export const selectProject = async (
  database: Pool,
  userId: string,
  id: string,
): Promise<Project | undefined> => {
  const result = await database.query<Project>(
    `SELECT ${projectColumns} FROM projects WHERE id = $1 AND owner_id = $2`,
    [id, userId],
  );

  return result.rows[0];
};

export const insertProject = async (
  database: Pool,
  userId: string,
  input: ProjectInput,
  limit: number,
): Promise<Project | null> => {
  const client = await database.connect();

  try {
    await client.query('BEGIN');
    await client.query('SELECT id FROM "user" WHERE id = $1 FOR UPDATE', [
      userId,
    ]);

    const count = await client.query<{ count: number }>(
      'SELECT count(*)::int AS count FROM projects WHERE owner_id = $1',
      [userId],
    );

    if (count.rows[0]!.count >= limit) {
      await client.query('ROLLBACK');

      return null;
    }

    const result = await client.query<Project>(
      `INSERT INTO projects (id, owner_id, stream_name, website_url, mode, description)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING ${projectColumns}`,
      [
        randomUUID(),
        userId,
        input.streamName,
        input.websiteUrl,
        input.mode,
        input.description,
      ],
    );

    await client.query('COMMIT');

    return result.rows[0]!;
  } catch (error) {
    await client.query('ROLLBACK');

    throw error;
  } finally {
    client.release();
  }
};

export const updateProject = async (
  database: Pool,
  userId: string,
  id: string,
  input: Partial<ProjectInput>,
): Promise<Project | undefined> => {
  const result = await database.query<Project>(
    `UPDATE projects SET
       stream_name = COALESCE($3, stream_name),
       website_url = COALESCE($4, website_url),
       mode = COALESCE($5, mode),
       description = COALESCE($6, description),
       updated_at = now()
     WHERE id = $1 AND owner_id = $2 RETURNING ${projectColumns}`,
    [
      id,
      userId,
      input.streamName ?? null,
      input.websiteUrl ?? null,
      input.mode ?? null,
      input.description ?? null,
    ],
  );

  return result.rows[0];
};

export const deleteProject = async (
  database: Pool,
  userId: string,
  id: string,
): Promise<boolean> => {
  const result = await database.query(
    'DELETE FROM projects WHERE id = $1 AND owner_id = $2',
    [id, userId],
  );

  return result.rowCount === 1;
};

export const linkUmamiWebsite = async (
  database: Pool,
  userId: string,
  id: string,
  websiteId: string,
): Promise<boolean> => {
  const result = await database.query(
    `UPDATE projects SET umami_website_id = $3, updated_at = now()
     WHERE id = $1 AND owner_id = $2 AND (umami_website_id IS NULL OR umami_website_id = $3)`,
    [id, userId, websiteId],
  );

  return result.rowCount === 1;
};
