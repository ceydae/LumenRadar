import { APIError } from 'better-auth/api';
import type { Request, Response } from 'express';

import { deleteProject } from '../../database/projects.js';
import { projectIdSchema } from '../../schemas/projects.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';

const deleteProjectRoute = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const id = projectIdSchema.safeParse(req.params.id);

  if (!id.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_PROJECT_ID',
      message: 'Use a valid project UUID.',
    });
  }

  const deleted = await deleteProject(
    res.locals.projectContext.database,
    res.locals.projectUserId,
    id.data,
  );

  if (!deleted) {
    throw new APIError('NOT_FOUND', {
      code: 'PROJECT_NOT_FOUND',
      message: 'Project not found.',
    });
  }

  res.status(204).end();
};

export default deleteProjectRoute;
