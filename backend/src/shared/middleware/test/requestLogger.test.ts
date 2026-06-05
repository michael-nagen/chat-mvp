import { afterEach, describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { requestLogger } from '../requestLogger';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('requestLogger', () => {
  it('calls next immediately and registers a finish listener', () => {
    const on = vi.fn();
    const next = vi.fn() as unknown as NextFunction;
    const req = { method: 'GET', originalUrl: '/x' } as Request;
    const res = { on, statusCode: 200 } as unknown as Response;

    requestLogger(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(on).toHaveBeenCalledWith('finish', expect.any(Function));
  });

  it('logs method, url, and status once the response finishes', () => {
    const log = vi.spyOn(console, 'log').mockImplementation(() => {});
    let finish: () => void = () => {};
    const next = vi.fn() as unknown as NextFunction;
    const req = { method: 'POST', originalUrl: '/auth/login' } as Request;
    const res = {
      statusCode: 201,
      on: (event: string, cb: () => void) => {
        if (event === 'finish') finish = cb;
      },
    } as unknown as Response;

    requestLogger(req, res, next);
    finish();

    expect(log).toHaveBeenCalledOnce();
    const line = log.mock.calls[0][0] as string;
    expect(line).toContain('POST');
    expect(line).toContain('/auth/login');
    expect(line).toContain('201');
  });
});
