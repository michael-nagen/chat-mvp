import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';
import { ValidationError } from '../errors/AppError';

type RequestPart = 'body' | 'query' | 'params';

type ValidationSchemas = Partial<Record<RequestPart, ZodTypeAny>>;

export const validate =
  (schemas: ValidationSchemas): RequestHandler =>
  (req, _res, next) => {
    for (const part of Object.keys(schemas) as RequestPart[]) {
      const schema = schemas[part];
      if (!schema) {
        continue;
      }

      const result = schema.safeParse(req[part]);
      if (!result.success) {
        throw new ValidationError(result.error.issues[0]?.message ?? 'Invalid request.');
      }

      req[part] = result.data;
    }

    next();
  };
