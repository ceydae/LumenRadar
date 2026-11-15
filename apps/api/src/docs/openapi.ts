import type { OpenAPIV3 } from 'openapi-types';

import { json } from './jsonContent.js';
import type { Config } from '../config.js';
import { error } from './errorResponse.js';
import { projectPaths } from './projects/paths.js';
import { projectSchemas } from './projects/schemas.js';

const sessionSecurity = [{ sessionCookie: [] }];

export const createOpenApi = (config: Config): OpenAPIV3.Document => {
  return {
    openapi: '3.0.3',
    info: {
      title: 'Lumen Radar API',
      version: '0.1.0',
      description: 'Discord login and project management for Lumen Radar. Project routes require the login session cookie. Each user can create up to 5 web projects.',
    },
    servers: [{ url: config.BETTER_AUTH_URL }],
    tags: [
      { name: 'Auth', description: 'Discord login and session management.' },
      { name: 'Projects', description: 'Manage your own projects. Web mode only for this release.' },
    ],
    paths: {
      ...projectPaths,
      '/api/auth/sign-in/social': {
        post: {
          tags: ['Auth'],
          operationId: 'signInWithDiscord',
          summary: 'Start Discord login',
          description: 'Call with credentials included. Navigate to the returned URL. Requests identify, email, and guilds.members.read. Discord calls the callback route after approval.',
          requestBody: {
            required: true,
            content: json({
              type: 'object',
              required: ['provider', 'callbackURL'],
              properties: {
                provider: { type: 'string', enum: ['discord'] },
                callbackURL: { type: 'string', format: 'uri', example: config.CLIENT_ORIGIN },
                errorCallbackURL: { type: 'string', format: 'uri', example: config.CLIENT_ORIGIN },
              },
            }),
          },
          responses: {
            '200': {
              description: 'Discord authorization URL. An OAuth state cookie is also set.',
              content: json({
                type: 'object',
                required: ['url', 'redirect'],
                properties: { url: { type: 'string', format: 'uri' }, redirect: { type: 'boolean' } },
              }),
            },
            '400': error('Invalid request.'),
            '403': error('Untrusted origin or callback URL.'),
            '404': error('Provider is not configured.'),
            '429': error('Too many requests.'),
            '500': error('Login could not be started.'),
            '503': error('Discord credentials have not been configured.'),
          },
        },
      },
      '/api/auth/callback/discord': {
        get: {
          tags: ['Auth'],
          operationId: 'discordCallback',
          summary: 'Complete Discord login',
          description: 'Called by Discord. Saves the user, Discord account, and session in PostgreSQL. Failures redirect with an error query parameter.',
          parameters: ['code', 'state', 'error', 'error_description'].map((name) => ({
            in: 'query', name, schema: { type: 'string' },
          })),
          responses: {
            '302': { description: 'Redirect to the frontend with a session cookie, or an error query parameter.' },
            '400': error('Invalid callback parameters.'),
            '429': error('Too many requests.'),
            '500': error('Login could not be completed.'),
          },
        },
      },
      '/api/auth/get-session': {
        get: {
          tags: ['Auth'],
          operationId: 'getSession',
          summary: 'Get the current session',
          description: 'Returns null without a valid session. The set-auth-jwt response header also contains a JWT when signed in.',
          responses: {
            '200': {
              description: 'Current session and user, or null.',
              content: json({
                type: 'object', nullable: true,
                properties: {
                  user: { $ref: '#/components/schemas/User' },
                  session: { $ref: '#/components/schemas/Session' },
                },
              }),
            },
            '429': error('Too many requests.'),
            '500': error('Session could not be read.'),
          },
        },
      },
      '/api/auth/token': {
        get: {
          tags: ['Auth'],
          operationId: 'getJwt',
          summary: 'Get a seven-day JWT',
          description: 'Requires the login session cookie. JWTs have audience lumen-radar and remain valid until expiry, including after sign-out.',
          security: sessionSecurity,
          responses: {
            '200': {
              description: 'Signed JWT.',
              content: json({ type: 'object', required: ['token'], properties: { token: { type: 'string' } } }),
            },
            '401': error('Missing or expired session.'),
            '429': error('Too many requests.'),
            '500': error('JWT could not be created.'),
          },
        },
      },
      '/api/auth/jwks': {
        get: {
          tags: ['Auth'],
          operationId: 'getJwks',
          summary: 'Get public JWT verification keys',
          responses: {
            '200': {
              description: 'Public JSON Web Key Set.',
              content: json({ type: 'object', required: ['keys'], properties: {
                keys: { type: 'array', items: { type: 'object', additionalProperties: true } },
              } }),
            },
            '429': error('Too many requests.'),
            '500': error('Keys could not be read.'),
          },
        },
      },
      '/api/auth/sign-out': {
        post: {
          tags: ['Auth'],
          operationId: 'signOut',
          summary: 'End the current session',
          description: 'Clears the session cookie and deletes the database session. Existing JWTs expire independently.',
          responses: {
            '200': {
              description: 'Signed out.',
              content: json({ type: 'object', properties: { success: { type: 'boolean' } } }),
            },
            '403': error('Untrusted origin.'),
            '429': error('Too many requests.'),
            '500': error('Sign-out failed.'),
          },
        },
      },
    },
    components: {
      securitySchemes: {
        sessionCookie: {
          type: 'apiKey', in: 'cookie',
          name: config.BETTER_AUTH_URL.startsWith('https://') ? '__Secure-better-auth.session_token' : 'better-auth.session_token',
        },
      },
      schemas: {
        ...projectSchemas,
        Error: {
          type: 'object', required: ['message'],
          properties: { code: { type: 'string' }, message: { type: 'string' } },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string', format: 'email' },
            emailVerified: { type: 'boolean' }, image: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string' }, userId: { type: 'string' }, token: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            createdAt: { type: 'string', format: 'date-time' }, updatedAt: { type: 'string', format: 'date-time' },
            ipAddress: { type: 'string', nullable: true }, userAgent: { type: 'string', nullable: true },
          },
        },
      },
    },
  };
};
