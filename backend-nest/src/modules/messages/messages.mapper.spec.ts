import { Message } from '../memory/entities';
import { toMessagePageResponse, toMessageResponse } from './messages.mapper';

const message: Message = {
  id: 'm1',
  conversationId: 'c1',
  senderId: 'u1',
  content: 'Hey Bob!',
  createdAt: '2026-06-04T08:00:00.000Z',
};

describe('messages.mapper', () => {
  it('maps createdAt to timestamp and preserves senderId', () => {
    expect(toMessageResponse(message)).toEqual({
      id: 'm1',
      conversationId: 'c1',
      senderId: 'u1',
      content: 'Hey Bob!',
      timestamp: '2026-06-04T08:00:00.000Z',
    });
  });

  it('wraps a page with messages and nextCursor', () => {
    expect(toMessagePageResponse([message], 'm1')).toEqual({
      messages: [toMessageResponse(message)],
      nextCursor: 'm1',
    });
    expect(toMessagePageResponse([], null)).toEqual({ messages: [], nextCursor: null });
  });
});
