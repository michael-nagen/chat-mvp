import { RequestHandler } from 'express';
import { ZodTypeAny } from 'zod';
import { ValidationError } from '../errors/AppError';

type RequestPart = 'body' | 'query' | 'params';

type ValidationSchemas = Partial<Record<RequestPart, ZodTypeAny>>;

/**
 * Builds a middleware that validates the named request parts against the given
 * Zod schemas. On success the parsed value — coerced and defaulted by Zod —
 * replaces the raw input on the request, so downstream handlers read clean,
 * typed data. The first validation issue is surfaced as a 400 ValidationError.
 *
 * Validation lives here rather than inline in each controller so every route
 * shares one consistent rejection path as the API grows.
 */
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
