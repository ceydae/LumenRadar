import { vi } from 'vitest';
import type { MockInstance } from 'vitest';

import { profile } from './discordProfile.js';
import type { DiscordMockOptions } from '../../src/types/tests/discordMockOptions.js';

export const mockDiscord = (options: DiscordMockOptions = {}): MockInstance<typeof fetch> => {
  return vi.spyOn(globalThis, 'fetch').mockImplementation(async (input: Parameters<typeof fetch>[0]): Promise<Response> => {
    const url = decodeURIComponent(input instanceof Request ? input.url : String(input));

    if (url === 'https://discord.com/api/oauth2/token') {
      return Response.json(options.tokenStatus ? { error: 'invalid_grant' } : {
        access_token: 'discord-access-token',
        refresh_token: 'discord-refresh-token',
        token_type: 'Bearer',
        expires_in: 3600,
        scope: 'identify email guilds.members.read',
      }, { status: options.tokenStatus ?? 200 });
    }

    if (url === 'https://discord.com/api/users/@me') {
      return Response.json(options.profileStatus ? { message: 'Unauthorized' } : {
        ...profile,
        email: options.email === undefined ? profile.email : options.email,
      }, { status: options.profileStatus ?? 200 });
    }

    throw new Error(`Unexpected outbound request: ${url}`);
  });
};
