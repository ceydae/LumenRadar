import { APIError } from 'better-auth/api';
import type { Request, Response } from 'express';

import { getWebProject } from './getWebProject.js';
import { requestUmami } from '../../umami/request.js';
import { linkUmamiWebsite } from '../../database/projects.js';
import type { ProjectLocals } from '../../types/projects/projectLocals.js';
import { umamiDomainSchema, umamiWebsiteSchema } from '../../schemas/umami.js';

const postAnalyticsSetup = async (
  req: Request,
  res: Response<unknown, ProjectLocals>,
): Promise<void> => {
  const project = await getWebProject(req.params.id, res.locals);
  const { database, umami } = res.locals.projectContext;

  if (project.umamiWebsiteId) {
    res.json({ websiteId: project.umamiWebsiteId });

    return;
  }

  const domain = umamiDomainSchema.safeParse(new URL(project.websiteUrl).hostname);

  if (!domain.success) {
    throw new APIError('BAD_REQUEST', {
      code: 'INVALID_ANALYTICS_DOMAIN',
      message: 'Use a domain name or localhost for web analytics.',
    });
  }

  // Use the project ID so retries recover the same website after a partial failure.
  const created = await requestUmami(umami, '/websites', {
    id: project.id,
    name: project.streamName,
    domain: domain.data,
  });

  const response = [400, 409, 500].includes(created.status)
    ? await requestUmami(umami, `/websites/${project.id}`)
    : created;

  const website = umamiWebsiteSchema.safeParse(
    response.ok ? await response.json().catch((): null => null) : null,
  );

  if (!website.success || website.data.id !== project.id) {
    throw new APIError('BAD_GATEWAY', {
      code: 'UMAMI_REQUEST_FAILED',
      message: 'Could not set up the Umami website. Try again.',
    });
  }

  const linked = await linkUmamiWebsite(database, res.locals.projectUserId, project.id, website.data.id);

  if (!linked) {
    throw new APIError('NOT_FOUND', { code: 'PROJECT_NOT_FOUND', message: 'Project not found.' });
  }

  res.json({ websiteId: website.data.id });
};

export default postAnalyticsSetup;
