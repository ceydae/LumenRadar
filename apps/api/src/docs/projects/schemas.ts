import type { OpenAPIV3 } from 'openapi-types';

export const projectSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  ProjectInput: {
    type: 'object',
    additionalProperties: false,
    required: ['streamName', 'websiteUrl', 'description', 'mode'],
    properties: {
      streamName: { type: 'string', minLength: 1, maxLength: 100, example: 'Example website' },
      websiteUrl: { type: 'string', format: 'uri', maxLength: 2048, example: 'https://example.com' },
      description: { type: 'string', minLength: 1, maxLength: 200, description: 'Explain how this project uses Stellar.', example: 'We use Stellar to settle payments.' },
      mode: { type: 'string', enum: ['web'], description: 'Only web is enabled. api and both are reserved for future releases.' },
    },
  },
  ProjectUpdate: {
    type: 'object',
    additionalProperties: false,
    minProperties: 1,
    properties: {
      streamName: { type: 'string', minLength: 1, maxLength: 100 },
      websiteUrl: { type: 'string', format: 'uri', maxLength: 2048 },
      description: { type: 'string', minLength: 1, maxLength: 200, description: 'Explain how this project uses Stellar.' },
      mode: { type: 'string', enum: ['web'] },
    },
  },
  Project: {
    type: 'object',
    required: ['id', 'streamName', 'websiteUrl', 'description', 'mode', 'createdAt', 'updatedAt'],
    properties: {
      id: { type: 'string', format: 'uuid' },
      streamName: { type: 'string' },
      websiteUrl: { type: 'string', format: 'uri' },
      description: { type: 'string', maxLength: 200, description: 'How this project uses Stellar. Existing projects may have an empty description until updated.' },
      mode: { type: 'string', enum: ['web', 'api', 'both'] },
      createdAt: { type: 'string', format: 'date-time' },
      updatedAt: { type: 'string', format: 'date-time' },
    },
  },
  ProjectResponse: {
    type: 'object',
    required: ['project'],
    properties: { project: { $ref: '#/components/schemas/Project' } },
  },
  ProjectListResponse: {
    type: 'object',
    required: ['projects'],
    properties: { projects: { type: 'array', maxItems: 5, items: { $ref: '#/components/schemas/Project' } } },
  },
};
