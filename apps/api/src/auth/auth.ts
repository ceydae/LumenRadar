import { betterAuth } from 'better-auth';
import { jwt } from 'better-auth/plugins';
import type { Pool } from 'pg';
import type { Config } from '../config.js';

export const SEVEN_DAYS = 60 * 60 * 24 * 7;

export function createAuth(config: Config, database: Pool) {
  return betterAuth({
    appName: 'Lumen Radar',
    baseURL: config.BETTER_AUTH_URL,
    secret: config.BETTER_AUTH_SECRET,
    database,
    trustedOrigins: [config.CLIENT_ORIGIN],
    advanced: { disableOriginCheck: false },
    emailAndPassword: { enabled: false },
    socialProviders: config.DISCORD_CLIENT_ID && config.DISCORD_CLIENT_SECRET ? {
      discord: {
        clientId: config.DISCORD_CLIENT_ID,
        clientSecret: config.DISCORD_CLIENT_SECRET,
        disableDefaultScope: true,
        scope: ['identify', 'email', 'guilds.members.read'],
        prompt: 'consent',
      },
    } : {},
    session: { expiresIn: SEVEN_DAYS },
    account: { encryptOAuthTokens: true },
    rateLimit: { enabled: true, window: 60, max: 60 },
    onAPIError: { throw: true, errorURL: config.CLIENT_ORIGIN },
    plugins: [jwt({
      jwt: {
        issuer: config.BETTER_AUTH_URL,
        audience: 'lumen-radar',
        expirationTime: '7d',
        definePayload: ({ user }) => ({ id: user.id }),
      },
    })],
  });
}

export type Auth = ReturnType<typeof createAuth>;
