import { Router, json } from 'express';

import getProjectsRoute from './get.js';
import postProjectRoute from './post.js';
import patchProjectRoute from './patch.js';
import getProjectRoute from './getById.js';
import deleteProjectRoute from './delete.js';
import getAnalytics from './getAnalytics.js';
import postAnalyticsSetup from './postAnalyticsSetup.js';
import { projectBodyError } from '../../middlewares/projects/projectBodyError.js';
import { requireProjectSession } from '../../middlewares/projects/requireProjectSession.js';

const projectRoutes = Router();

projectRoutes.use(requireProjectSession);
projectRoutes.use(json({ limit: '16kb' }));
projectRoutes.use(projectBodyError);

projectRoutes.get('/', getProjectsRoute);
projectRoutes.post('/', postProjectRoute);
projectRoutes.get('/:id', getProjectRoute);
projectRoutes.patch('/:id', patchProjectRoute);
projectRoutes.delete('/:id', deleteProjectRoute);
projectRoutes.post('/:id/analytics/setup', postAnalyticsSetup);
projectRoutes.get('/:id/analytics', getAnalytics);

export default projectRoutes;
