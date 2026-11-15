import { APIError } from 'better-auth/api';
import type { Request, Response } from 'express';

import { insertProject } from '../../database/projects.js';
import { projectInputSchema } from '../../schemas/projects.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';

const postProjectRoute = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const input = projectInputSchema.safeParse(req.body);

  if (!input.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_PROJECT',
      message: input.error.issues[0]!.message,
    });
  }

  const project = await insertProject(
    res.locals.projectContext.database,
    res.locals.projectUserId,
    input.data,
    5,
  );

  if (!project) {
    throw new APIError('CONFLICT', {
      code: 'PROJECT_LIMIT_REACHED',
      message:
        'You can have up to 5 projects. Delete a project before creating another.',
    });
  }

  res.location(`/api/projects/${project.id}`).status(201).json({ project });
};

export default postProjectRoute;
