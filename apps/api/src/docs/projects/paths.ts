import type { OpenAPIV3 } from 'openapi-types';

import { projectResponses, analyticsResponses } from './responses.js';

export const projectPaths: OpenAPIV3.PathsObject = {
  '/api/projects': {
    get: {
      tags: ['Projects'],
      operationId: 'listProjects',
      summary: 'List your projects',
      description: 'Returns only the current user\'s projects, newest first. Send the Discord login session cookie with credentials included. Bearer JWT authentication is not supported by these routes.',
      security: [{ sessionCookie: [] }],
      responses: {
        ...projectResponses,
        '200': {
          description: 'Your projects, or an empty list.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectListResponse' } } },
        },
      },
    },
    post: {
      tags: ['Projects'],
      operationId: 'createProject',
      summary: 'Create a web project',
      description: 'Requires streamName, an HTTP(S) websiteUrl, a description of how the project uses Stellar (1-200 characters), and mode: web. Ownership comes from the session. Each user may own at most 5 projects. API and combined modes are not enabled yet.',
      security: [{ sessionCookie: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectInput' } } },
      },
      responses: {
        ...projectResponses,
        '201': {
          description: 'Created project.',
          headers: { Location: { description: 'Project resource URL.', schema: { type: 'string' } } },
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectResponse' } } },
        },
        '409': {
          description: 'PROJECT_LIMIT_REACHED: delete a project before creating another.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
        },
      },
    },
  },
  '/api/projects/{id}': {
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
    get: {
      tags: ['Projects'],
      operationId: 'getProject',
      summary: 'Get one of your projects',
      description: 'Use the project UUID returned when creating or listing projects. Returns all project fields, including the Stellar usage description. Projects belonging to other users return 404.',
      security: [{ sessionCookie: [] }],
      responses: {
        ...projectResponses,
        '200': {
          description: 'Project details.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectResponse' } } },
        },
      },
    },
    patch: {
      tags: ['Projects'],
      operationId: 'updateProject',
      summary: 'Update one of your projects',
      description: 'Send at least one of streamName, websiteUrl, description (1-200 characters), or mode. Only web mode is enabled. Ownership cannot be changed.',
      security: [{ sessionCookie: [] }],
      requestBody: {
        required: true,
        content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectUpdate' } } },
      },
      responses: {
        ...projectResponses,
        '200': {
          description: 'Updated project.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectResponse' } } },
        },
      },
    },
    delete: {
      tags: ['Projects'],
      operationId: 'deleteProject',
      summary: 'Delete one of your projects',
      description: 'Permanently deletes the project and frees one project slot.',
      security: [{ sessionCookie: [] }],
      responses: {
        ...projectResponses,
        '204': { description: 'Project deleted. No response body.' },
      },
    },
  },
  '/api/projects/{id}/analytics/setup': {
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
    post: {
      tags: ['Projects'],
      operationId: 'setupProjectAnalytics',
      summary: 'Set up web analytics for your project',
      description: 'Creates or reuses the project website in Umami. Use the returned websiteId in the tracking script.',
      security: [{ sessionCookie: [] }],
      responses: {
        ...projectResponses,
        '200': {
          description: 'Website ready for tracker installation.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectAnalyticsSetup' } } },
        },
        ...analyticsResponses,
      },
    },
  },
  '/api/projects/{id}/analytics': {
    parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
    get: {
      tags: ['Projects'],
      operationId: 'getProjectAnalytics',
      summary: 'Read pageviews for your project',
      description: 'Omit both timestamps for all-time pageviews, or send both for a specific range.',
      security: [{ sessionCookie: [] }],
      parameters: [
        { name: 'startAt', in: 'query', description: 'Range start in Unix milliseconds. Required if endAt is provided.', schema: { type: 'integer', format: 'int64', minimum: 0 } },
        { name: 'endAt', in: 'query', description: 'Range end in Unix milliseconds, greater than startAt. Required if startAt is provided.', schema: { type: 'integer', format: 'int64', minimum: 0 } },
      ],
      responses: {
        ...projectResponses,
        '200': {
          description: 'Pageviews for the selected range, including zero when no visits were recorded.',
          content: { 'application/json': { schema: { $ref: '#/components/schemas/ProjectAnalytics' } } },
        },
        ...analyticsResponses,
      },
    },
  },
};
