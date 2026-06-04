import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { requireAuth } from '../requireAuth';
import { UnauthorizedError } from '../../errors/AppError';

const makeReq = (authorization?: string): Request =>
  ({
    header: (name: string) =>
      name.toLowerCase() === 'authorization' ? authorization : undefined,
  }) as unknown as Request;

const res = {} as Response;

describe('requireAuth', () => {
  it('sets req.userId and calls next for a valid token of a known user', () => {
    const req = makeReq('Bearer mock-token-u1');
    const next = vi.fn() as unknown as NextFunction;

    requireAuth(req, res, next);

    expect(req.userId).toBe('u1');
    expect(next).toHaveBeenCalledOnce();
    expect((next as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBeUndefined();
  });

  it('throws when the Authorization header is missing', () => {
    expect(() => requireAuth(makeReq(undefined), res, vi.fn())).toThrow(UnauthorizedError);
  });

  it('throws when the header is not a Bearer scheme', () => {
    expect(() => requireAuth(makeReq('Basic abc'), res, vi.fn())).toThrow(UnauthorizedError);
  });

  it('throws when the token lacks the mock-token- prefix', () => {
    expect(() => requireAuth(makeReq('Bearer something-else'), res, vi.fn())).toThrow(
      UnauthorizedError,
    );
  });

  it('throws when the user id does not resolve to a known user', () => {
    expect(() => requireAuth(makeReq('Bearer mock-token-ghost'), res, vi.fn())).toThrow(
      UnauthorizedError,
    );
  });
});
