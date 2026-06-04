import { describe, expect, it } from 'vitest';
import { messageRepository } from '../index';
import type { Message } from '../../messages.types';

const makeMessage = (overrides: Partial<Message> = {}): Message => ({
  id: 'm-test',
  conversationId: 'c1',
  senderId: 'u1',
  content: 'hi',
  createdAt: '2026-06-04T09:00:00.000Z',
  ...overrides,
});

describe('messageRepository.findByConversation', () => {
  it('returns only messages of the given conversation', () => {
    const result = messageRepository.findByConversation('c1');
    expect(result.length).toBeGreaterThanOrEqual(3);
    expect(result.every((m) => m.conversationId === 'c1')).toBe(true);
  });

  it('returns an empty array for a conversation with no messages', () => {
    expect(messageRepository.findByConversation('c-empty')).toEqual([]);
  });
});

describe('messageRepository.insert', () => {
  it('persists and returns the message', () => {
    const message = makeMessage({ id: 'm-insert-1', conversationId: 'c-insert-target' });
    const returned = messageRepository.insert(message);
    expect(returned).toBe(message);
    expect(messageRepository.findByConversation('c-insert-target')).toContainEqual(message);
  });
});
