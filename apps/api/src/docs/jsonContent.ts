import type { OpenAPIV3 } from 'openapi-types';

export const json = (
  schema: OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject,
): Record<string, OpenAPIV3.MediaTypeObject> => {
  return { 'application/json': { schema } };
};
