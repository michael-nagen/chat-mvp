import { describe, expect, it } from 'vitest';
import { createMessageSchema } from '../messages.schemas';

describe('createMessageSchema', () => {
  it('accepts non-empty content', () => {
    expect(createMessageSchema.safeParse({ content: 'hi' }).success).toBe(true);
  });

  it('rejects empty content with a helpful message', () => {
    const result = createMessageSchema.safeParse({ content: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('content is required.');
    }
  });

  it('rejects missing content', () => {
    expect(createMessageSchema.safeParse({}).success).toBe(false);
  });
});
