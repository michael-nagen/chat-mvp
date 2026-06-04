import { describe, expect, it, vi } from 'vitest';
import type { Request, Response } from 'express';
import { errorHandler } from '../errorHandler';
import { ValidationError } from '../AppError';
import { ErrorCodes } from '../errorCodes';

const mockRes = () => {
  const res = {} as Response;
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  return res;
};

describe('errorHandler', () => {
  it('maps an AppError to its statusCode and error envelope', () => {
    const res = mockRes();
    errorHandler(new ValidationError('bad input'), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: ErrorCodes.VALIDATION_ERROR, message: 'bad input' },
    });
  });

  it('maps an unknown error to a generic 500', () => {
    const res = mockRes();
    errorHandler(new Error('boom'), {} as Request, res, vi.fn());

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred.' },
    });
  });

  it('does not leak the original message on a non-AppError', () => {
    const res = mockRes();
    errorHandler(new Error('secret stack detail'), {} as Request, res, vi.fn());

    const payload = (res.json as ReturnType<typeof vi.fn>).mock.calls[0][0];
    expect(payload.error.message).not.toContain('secret');
  });
});
