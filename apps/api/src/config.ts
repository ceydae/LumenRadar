import type { ZodIssue } from 'zod';

import type { Config } from './types/config.js';
import { configSchema } from './schemas/config.js';

export const readConfig = (env: NodeJS.ProcessEnv = process.env): Config => {
  const result = configSchema.safeParse(env);

  if (!result.success) {
    const details = result.error.issues.map(
      (issue: ZodIssue): string => `${issue.path.join('.')}: ${issue.message}`,
    );

    throw new Error(
      `Invalid environment configuration:\n${details.join('\n')}`,
    );
  }

  return result.data;
};
