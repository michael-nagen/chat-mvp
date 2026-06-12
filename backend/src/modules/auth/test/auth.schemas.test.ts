import { describe, expect, it } from 'vitest';
import { loginSchema } from '../auth.schemas';

describe('loginSchema', () => {
  it('accepts a non-empty name', () => {
    const result = loginSchema.safeParse({ name: 'Alice' });
    expect(result.success).toBe(true);
  });

  it('rejects an empty name with a helpful message', () => {
    const result = loginSchema.safeParse({ name: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('name is required.');
    }
  });

  it('rejects a missing name', () => {
    expect(loginSchema.safeParse({}).success).toBe(false);
  });

  it('rejects a non-string name', () => {
    expect(loginSchema.safeParse({ name: 123 }).success).toBe(false);
  });
});
