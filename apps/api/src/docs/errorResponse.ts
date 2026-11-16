import type { OpenAPIV3 } from 'openapi-types';

import { json } from './jsonContent.js';

export const error = (description: string): OpenAPIV3.ResponseObject => {
  return {
    description,
    content: json({ $ref: '#/components/schemas/Error' }),
  };
};
