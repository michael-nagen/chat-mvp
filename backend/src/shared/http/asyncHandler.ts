import { RequestHandler } from 'express';

/**
 * Wraps a route handler so any thrown or rejected error is forwarded to the
 * centralized error handler via next(err), covering both sync throws and
 * rejected promises. This lets controllers stay free of try/catch.
 */
export const asyncHandler =
  (handler: RequestHandler): RequestHandler =>
  (req, res, next) => {
    try {
      const result: unknown = handler(req, res, next);
      if (result instanceof Promise) {
        result.catch(next);
      }
    } catch (err) {
      next(err);
    }
  };
