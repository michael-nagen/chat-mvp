import { describe, expect, it } from 'vitest';
import { authService } from '../auth.service';
import { UnauthorizedError } from '../../../shared/errors/AppError';

describe('authService.login', () => {
  it('returns a mock token and the user for a known name', () => {
    const result = authService.login('Alice');
    expect(result.user).toEqual({ id: 'u1', name: 'Alice' });
    expect(result.token).toBe('mock-token-u1');
  });

  it('matches names case-insensitively and trimmed', () => {
    expect(authService.login('  bOb  ').user.id).toBe('u2');
  });

  it('throws UnauthorizedError for an unknown name', () => {
    expect(() => authService.login('Nobody')).toThrow(UnauthorizedError);
  });
});
