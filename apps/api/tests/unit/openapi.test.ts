import { describe, expect, it } from 'vitest';
import SwaggerParser from '@apidevtools/swagger-parser';

import { testConfig } from '../helpers/config.js';
import { createOpenApi } from '../../src/docs/openapi.js';

describe('OpenAPI', () => {
  it('is a valid specification covering every mounted auth route', async () => {
    const spec = createOpenApi(testConfig);
    await expect(SwaggerParser.validate(structuredClone(spec))).resolves.toBeDefined();
    expect(Object.keys(spec.paths)).toHaveLength(10);
    expect(spec.info.title).toBe('Lumen Radar API');
    expect(spec.paths['/api/auth/sign-in/social']?.post).toBeDefined();
    expect(spec.paths['/api/projects']?.post).toBeDefined();
    expect(spec.paths['/api/projects/{id}']?.patch).toBeDefined();
  });

  it('uses the production cookie name', () => {
    const spec = createOpenApi({ ...testConfig, NODE_ENV: 'production', BETTER_AUTH_URL: 'https://api.example.com' });
    expect(spec.components?.securitySchemes?.sessionCookie).toHaveProperty('name', '__Secure-better-auth.session_token');
  });
});
