import type request from 'supertest';
import type { Response } from 'supertest';

export interface DiscordLogin {
  agent: ReturnType<typeof request.agent>;
  start: Response;
  state: string;
}
