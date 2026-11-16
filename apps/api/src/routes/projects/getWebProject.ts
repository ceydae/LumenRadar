import { APIError } from 'better-auth/api';

import { selectProject } from '../../database/projects.js';
import { projectIdSchema } from '../../schemas/projects.js';
import type { Project } from '../../types/projects/project.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';

export const getWebProject = async (
  id: unknown,
  locals: ProjectLocals,
): Promise<Project> => {
  const parsedId = projectIdSchema.safeParse(id);

  if (!parsedId.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_PROJECT_ID',
      message: 'Use a valid project UUID.',
    });
  }

  const project = await selectProject(
    locals.projectContext.database,
    locals.projectUserId,
    parsedId.data,
  );

  if (!project) {
    throw new APIError('NOT_FOUND', { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' });
  }

  if (project.mode !== 'web') {
    throw new APIError('CONFLICT', {
      code: 'WEB_ANALYTICS_UNAVAILABLE',
      message: 'Web analytics is only available for web projects.',
    });
  }

  return project;
};
