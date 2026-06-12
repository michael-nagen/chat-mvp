import { describe, expect, it } from 'vitest';
import { createMessageSchema, listMessagesQuerySchema } from '../messages.schemas';

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

describe('listMessagesQuerySchema', () => {
  it('defaults limit to 20 when omitted', () => {
    const result = listMessagesQuerySchema.safeParse({});
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.limit).toBe(20);
      expect(result.data.cursor).toBeUndefined();
    }
  });

  it('coerces a numeric-string limit and keeps the cursor', () => {
    const result = listMessagesQuerySchema.safeParse({ cursor: 'm2', limit: '5' });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ cursor: 'm2', limit: 5 });
    }
  });

  it('rejects a non-positive limit', () => {
    expect(listMessagesQuerySchema.safeParse({ limit: '0' }).success).toBe(false);
  });

  it('rejects a non-numeric limit', () => {
    expect(listMessagesQuerySchema.safeParse({ limit: 'abc' }).success).toBe(false);
  });
});
