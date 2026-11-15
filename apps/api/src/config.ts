import { z } from 'zod';

const origin = z.url().refine((value) => {
  const url = new URL(value);
  return ['http:', 'https:'].includes(url.protocol) && url.origin === value;
}, 'Use an HTTP(S) origin without a path or trailing slash.');

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(3000),
  BETTER_AUTH_URL: origin,
  BETTER_AUTH_SECRET: z.string().min(32),
  CLIENT_ORIGIN: origin,
  DATABASE_URL: z.url().refine((value) => {
    const url = new URL(value);
    return ['postgres:', 'postgresql:'].includes(url.protocol) && url.pathname.length > 1;
  }, 'Use a PostgreSQL connection URL with a database name.'),
  DISCORD_CLIENT_ID: z.string().default(''),
  DISCORD_CLIENT_SECRET: z.string().default(''),
}).superRefine((env, ctx) => {
  if (Boolean(env.DISCORD_CLIENT_ID) !== Boolean(env.DISCORD_CLIENT_SECRET)) {
    ctx.addIssue({ code: 'custom', path: ['DISCORD_CLIENT_ID'], message: 'Set both Discord credentials.' });
  }
  if (env.NODE_ENV === 'production') {
    for (const field of ['BETTER_AUTH_URL', 'CLIENT_ORIGIN'] as const) {
      if (!env[field].startsWith('https://')) {
        ctx.addIssue({ code: 'custom', path: [field], message: 'HTTPS is required in production.' });
      }
    }
    if (!env.DISCORD_CLIENT_ID || !env.DISCORD_CLIENT_SECRET) {
      ctx.addIssue({ code: 'custom', path: ['DISCORD_CLIENT_ID'], message: 'Discord credentials are required in production.' });
    }
  }
});

export type Config = z.infer<typeof schema>;

export function readConfig(env: NodeJS.ProcessEnv = process.env): Config {
  const result = schema.safeParse(env);
  if (!result.success) {
    const details = result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);
    throw new Error(`Invalid environment configuration:\n${details.join('\n')}`);
  }
  return result.data;
}
