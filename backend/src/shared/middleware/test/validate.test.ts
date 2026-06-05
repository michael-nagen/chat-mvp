import { describe, expect, it, vi } from 'vitest';
import type { NextFunction, Request, Response } from 'express';
import { z } from 'zod';
import { validate } from '../validate';
import { ValidationError } from '../../errors/AppError';

const res = {} as Response;

const bodySchema = z.object({ title: z.string().min(1, 'title is required.') });
const querySchema = z.object({ limit: z.coerce.number().int().positive().default(20) });

const makeReq = (overrides: Partial<Request>): Request => overrides as Request;

describe('validate', () => {
  it('calls next and leaves valid input in place', () => {
    const req = makeReq({ body: { title: 'Hello' } });
    const next = vi.fn() as unknown as NextFunction;

    validate({ body: bodySchema })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect((next as ReturnType<typeof vi.fn>).mock.calls[0][0]).toBeUndefined();
    expect(req.body).toEqual({ title: 'Hello' });
  });

  it('throws a ValidationError with the first issue message for a bad body', () => {
    const req = makeReq({ body: { title: '' } });
    expect(() => validate({ body: bodySchema })(req, res, vi.fn())).toThrow(ValidationError);
    expect(() => validate({ body: bodySchema })(req, res, vi.fn())).toThrow('title is required.');
  });

  it('throws when the wrong type is supplied', () => {
    const req = makeReq({ body: { title: 123 } });
    expect(() => validate({ body: bodySchema })(req, res, vi.fn())).toThrow(ValidationError);
  });

  it('throws when the body is not an object', () => {
    const req = makeReq({ body: undefined });
    expect(() => validate({ body: bodySchema })(req, res, vi.fn())).toThrow(ValidationError);
  });

  it('writes Zod-coerced and defaulted values back onto the request', () => {
    const req = makeReq({ query: { limit: '5' } as unknown as Request['query'] });
    const next = vi.fn() as unknown as NextFunction;

    validate({ query: querySchema })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.query).toEqual({ limit: 5 });
  });

  it('validates multiple request parts in one pass', () => {
    const req = makeReq({
      body: { title: 'Hi' },
      query: {} as unknown as Request['query'],
    });
    const next = vi.fn() as unknown as NextFunction;

    validate({ body: bodySchema, query: querySchema })(req, res, next);

    expect(next).toHaveBeenCalledOnce();
    expect(req.query).toEqual({ limit: 20 });
  });
});
