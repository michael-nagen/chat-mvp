import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { asyncHandler } from '../asyncHandler';

const req = {} as Request;
const res = {} as Response;

describe('asyncHandler', () => {
  it('invokes the wrapped handler and does not call next on success', () => {
    const next = vi.fn() as unknown as NextFunction;
    const handler = vi.fn();

    asyncHandler(handler)(req, res, next);

    expect(handler).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  it('forwards a synchronous throw to next', () => {
    const next = vi.fn() as unknown as NextFunction;
    const error = new Error('sync boom');

    asyncHandler(() => {
      throw error;
    })(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });

  it('forwards a rejected promise to next', async () => {
    const next = vi.fn() as unknown as NextFunction;
    const error = new Error('async boom');

    asyncHandler(async () => {
      throw error;
    })(req, res, next);

    await vi.waitFor(() => expect(next).toHaveBeenCalledWith(error));
  });

  it('does not call next when an async handler resolves', async () => {
    const next = vi.fn() as unknown as NextFunction;

    asyncHandler(async () => undefined)(req, res, next);

    await new Promise((resolve) => setImmediate(resolve));
    expect(next).not.toHaveBeenCalled();
  });
});
