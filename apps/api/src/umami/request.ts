import { APIError } from 'better-auth/api';

import type { ProjectContext } from '../types/projects/projectContext.js';

export const requestUmami = async (
  config: ProjectContext['umami'],
  path: string,
  body?: { id: string; name: string; domain: string },
): Promise<Response> => {
  if (!config.UMAMI_API_KEY) {
    throw new APIError('SERVICE_UNAVAILABLE', {
      code: 'UMAMI_NOT_CONFIGURED',
      message: 'Web analytics is not configured.',
    });
  }

  try {
    return await fetch(`${config.UMAMI_API_URL.replace(/\/+$/, '')}${path}`, {
      method: body ? 'POST' : 'GET',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${config.UMAMI_API_KEY}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      redirect: 'error',
      signal: AbortSignal.timeout(5_000),
    });
  } catch {
    throw new APIError('BAD_GATEWAY', {
      code: 'UMAMI_REQUEST_FAILED',
      message: 'Could not reach Umami. Try again.',
    });
  }
};
