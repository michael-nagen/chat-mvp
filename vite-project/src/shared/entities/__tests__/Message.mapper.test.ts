import { describe, expect, it } from 'vitest';
import { toMessage } from '../Message.mapper';
import type { RawMessage } from '../Message.types';

const raw: RawMessage = {
  id: 'm1',
  conversationId: 'c1',
  content: 'hi',
  senderId: 'u1',
  timestamp: '2026-06-10T00:00:00.000Z',
};

describe('toMessage', () => {
  it("labels the current user's own message as 'user'", () => {
    expect(toMessage({ raw, currentUserId: 'u1' }).sender).toBe('user');
  });

  it("labels another author's message as 'assistant'", () => {
    expect(toMessage({ raw, currentUserId: 'u2' }).sender).toBe('assistant');
  });

  it("labels as 'assistant' when there is no current user", () => {
    expect(toMessage({ raw, currentUserId: null }).sender).toBe('assistant');
  });

  it('carries the remaining fields through unchanged', () => {
    const result = toMessage({ raw, currentUserId: 'u1' });
    expect(result).toMatchObject({
      id: 'm1',
      conversationId: 'c1',
      content: 'hi',
      timestamp: '2026-06-10T00:00:00.000Z',
    });
  });
});
