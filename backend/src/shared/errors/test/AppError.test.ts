import { describe, expect, it } from 'vitest';
import {
  AppError,
  ConversationNotFoundError,
  UnauthorizedError,
  ValidationError,
} from '../AppError';
import { ErrorCodes } from '../errorCodes';

describe('AppError', () => {
  it('stores statusCode, code, and message', () => {
    const err = new AppError(418, ErrorCodes.VALIDATION_ERROR, 'teapot');
    expect(err.statusCode).toBe(418);
    expect(err.code).toBe(ErrorCodes.VALIDATION_ERROR);
    expect(err.message).toBe('teapot');
  });

  it('is an instance of Error', () => {
    expect(new AppError(500, ErrorCodes.VALIDATION_ERROR, 'x')).toBeInstanceOf(Error);
  });

  it('sets name to the concrete subclass name', () => {
    expect(new ValidationError().name).toBe('ValidationError');
    expect(new AppError(500, ErrorCodes.VALIDATION_ERROR, 'x').name).toBe('AppError');
  });
});

describe('AppError subclasses', () => {
  it('ValidationError -> 400 / VALIDATION_ERROR', () => {
    const err = new ValidationError();
    expect(err.statusCode).toBe(400);
    expect(err.code).toBe(ErrorCodes.VALIDATION_ERROR);
  });

  it('UnauthorizedError -> 401 / UNAUTHORIZED', () => {
    const err = new UnauthorizedError();
    expect(err.statusCode).toBe(401);
    expect(err.code).toBe(ErrorCodes.UNAUTHORIZED);
  });

  it('ConversationNotFoundError -> 404 / CONVERSATION_NOT_FOUND', () => {
    const err = new ConversationNotFoundError();
    expect(err.statusCode).toBe(404);
    expect(err.code).toBe(ErrorCodes.CONVERSATION_NOT_FOUND);
  });

  it('accepts a custom message and keeps a default otherwise', () => {
    expect(new UnauthorizedError('custom').message).toBe('custom');
    expect(new UnauthorizedError().message).toBe('Unauthorized.');
  });
});
