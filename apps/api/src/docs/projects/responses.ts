import type { OpenAPIV3 } from 'openapi-types';

export const projectResponses: OpenAPIV3.ResponsesObject = {
  '400': {
    description: 'Invalid fields, malformed JSON, unsupported mode, or invalid project UUID.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '401': {
    description: 'Missing, expired, or revoked Discord login session.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '403': {
    description: 'Untrusted request origin.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '404': {
    description: 'Project does not exist or belongs to another user.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '413': {
    description: 'Request body exceeds 16 KB.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '500': {
    description: 'Unexpected server error.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
};

export const analyticsResponses: OpenAPIV3.ResponsesObject = {
  '409': {
    description: 'Web analytics is not available for the project or has not been set up.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '502': {
    description: 'Umami did not return a valid response.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
  '503': {
    description: 'The Umami API key is missing on the server.',
    content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } },
  },
};
