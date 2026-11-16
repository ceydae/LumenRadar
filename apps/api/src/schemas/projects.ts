import { z } from 'zod';

import type { ProjectInput } from '../types/projects/projectInput.js';

export const projectInputSchema = z.strictObject({
  streamName: z.string().trim().min(1).max(100),
  websiteUrl: z
    .url({ protocol: /^https?$/, hostname: /.+/ })
    .trim()
    .max(2048),
  description: z.string().trim().min(1).max(200),
  mode: z.literal('web', {
    error:
      'Only web projects are available. API and combined projects are coming later.',
  }),
});

export const projectUpdateSchema = projectInputSchema
  .partial()
  .refine(
    (value: Partial<ProjectInput>): boolean => Object.keys(value).length > 0,
    'Provide at least one project field.',
  );

export const projectIdSchema = z.uuid();
