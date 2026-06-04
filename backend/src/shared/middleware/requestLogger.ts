import { RequestHandler } from 'express';

/**
 * Logs each request once the response is sent: method, path, status code, and
 * how long it took to handle.
 */
export const requestLogger: RequestHandler = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const durationMs = Number(process.hrtime.bigint() - start) / 1_000_000;
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${durationMs.toFixed(1)}ms`);
  });

  next();
};
