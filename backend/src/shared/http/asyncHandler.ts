import { RequestHandler } from 'express';

// Forwards sync throws and rejected promises to next(err) so controllers need no try/catch.
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
