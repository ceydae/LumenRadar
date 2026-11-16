import { APIError } from 'better-auth/api';
import type { Request, Response } from 'express';

import { getWebProject } from './getWebProject.js';
import { requestUmami } from '../../umami/request.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';
import { analyticsRangeSchema, umamiStatsSchema } from '../../schemas/umami.js';

const getAnalytics = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const range = analyticsRangeSchema.safeParse(req.query);

  if (!range.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_ANALYTICS_RANGE',
      message: 'Omit both timestamps for all-time analytics, or pass both in Unix milliseconds with endAt greater than startAt.',
    });
  }

  const project = await getWebProject(req.params.id, res.locals);

  if (!project.umamiWebsiteId) {
    throw new APIError('CONFLICT', {
      code: 'WEB_ANALYTICS_NOT_CONFIGURED',
      message: 'Set up web analytics for this project first.',
    });
  }

  // Use a positive epoch timestamp to request all available history from Umami.
  const params = new URLSearchParams({
    startAt: String(range.data.startAt ?? 1),
    endAt: String(range.data.endAt ?? Date.now()),
  });

  const response = await requestUmami(
    res.locals.projectContext.umami,
    `/websites/${project.umamiWebsiteId}/stats?${params}`,
  );

  const stats = umamiStatsSchema.safeParse(
    response.ok ? await response.json().catch((): null => null) : null,
  );

  if (!stats.success) {
    throw new APIError('BAD_GATEWAY', {
      code: 'UMAMI_REQUEST_FAILED',
      message: 'Could not read web analytics from Umami. Try again.',
    });
  }

  res.json(stats.data);
};

export default getAnalytics;
