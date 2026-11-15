import type { Request, Response } from 'express';

import { selectProjects } from '../../database/projects.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';

const getProjectsRoute = async (
  _req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const projects = await selectProjects(
    res.locals.projectContext.database,
    res.locals.projectUserId,
  );

  res.json({ projects });
};

export default getProjectsRoute;
