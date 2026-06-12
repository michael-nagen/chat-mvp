import { describe, expect, it } from 'vitest';
import { createConversationSchema } from '../conversations.schemas';

describe('createConversationSchema', () => {
  it('accepts a non-empty title', () => {
    expect(createConversationSchema.safeParse({ title: 'Hi' }).success).toBe(true);
  });

  it('rejects an empty title with a helpful message', () => {
    const result = createConversationSchema.safeParse({ title: '' });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('title is required.');
    }
  });

  it('rejects a missing title', () => {
    expect(createConversationSchema.safeParse({}).success).toBe(false);
  });
});
