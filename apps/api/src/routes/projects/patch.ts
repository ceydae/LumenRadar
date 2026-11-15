import { APIError } from 'better-auth/api';
import type { Request, Response } from 'express';

import { updateProject } from '../../database/projects.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';
import {
  projectIdSchema,
  projectUpdateSchema,
} from '../../schemas/projects.js';

const patchProjectRoute = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const id = projectIdSchema.safeParse(req.params.id);
  const input = projectUpdateSchema.safeParse(req.body);

  if (!id.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_PROJECT_ID',
      message: 'Use a valid project UUID.',
    });
  }

  if (!input.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_PROJECT',
      message: input.error.issues[0]!.message,
    });
  }

  const project = await updateProject(
    res.locals.projectContext.database,
    res.locals.projectUserId,
    id.data,
    input.data,
  );

  if (!project) {
    throw new APIError('NOT_FOUND', {
      code: 'PROJECT_NOT_FOUND',
      message: 'Project not found.',
    });
  }

  res.json({ project });
};

export default patchProjectRoute;
