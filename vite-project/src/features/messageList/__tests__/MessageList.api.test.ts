import { beforeAll, describe, expect, it } from 'vitest';
import { getConversationMessages } from '../model/MessageList.api';
import { post, setTokenProvider } from '../../../shared/api/apiClient';

beforeAll(async () => {
  const { token } = await post<{ token: string }>(
    '/auth/login',
    { email: 'alice@example.com', password: 'password' },
    { auth: false },
  );
  setTokenProvider(() => token);
});

describe('getConversationMessages cursor pagination', () => {
  it('returns a first page with a cursor, then a non-overlapping older page', async () => {
    const first = await getConversationMessages({ conversationId: 'c1', limit: 2 });

    expect(first.messages).toHaveLength(2);
    expect(first.nextCursor).not.toBeNull();

    const next = await getConversationMessages({
      conversationId: 'c1',
      cursor: first.nextCursor ?? undefined,
      limit: 2,
    });
    const firstIds = new Set(first.messages.map((message) => message.id));

    expect(next.messages.length).toBeGreaterThan(0);
    expect(next.messages.some((message) => firstIds.has(message.id))).toBe(false);
    expect(next.nextCursor).not.toBe(first.nextCursor);
  });
});
