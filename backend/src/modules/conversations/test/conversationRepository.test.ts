import { describe, expect, it } from 'vitest';
import { conversationRepository } from '../conversations.repo';
import type { Conversation } from '../conversations.types';

const makeConversation = (overrides: Partial<Conversation> = {}): Conversation => ({
  id: 'c-test',
  title: 'Test',
  participantIds: ['u1'],
  lastMessage: '',
  updatedAt: '2026-06-04T00:00:00.000Z',
  ...overrides,
});

describe('conversationRepository.getConversationsForUser', () => {
  it('returns conversations that include the user as a participant', () => {
    const result = conversationRepository.getConversationsForUser('u2');
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((c) => c.participantIds.includes('u2'))).toBe(true);
  });

  it('returns an empty array for a non-participant', () => {
    expect(conversationRepository.getConversationsForUser('ghost')).toEqual([]);
  });
});

describe('conversationRepository.findById', () => {
  it('finds a seeded conversation', () => {
    expect(conversationRepository.findById('c1')?.title).toBe('Alice & Bob');
  });

  it('returns undefined for an unknown id', () => {
    expect(conversationRepository.findById('nope')).toBeUndefined();
  });
});

describe('conversationRepository.insert', () => {
  it('persists and returns the conversation', () => {
    const conversation = makeConversation({ id: 'c-insert-1' });
    const returned = conversationRepository.insert(conversation);
    expect(returned).toBe(conversation);
    expect(conversationRepository.findById('c-insert-1')).toEqual(conversation);
  });
});

describe('conversationRepository.updateLastMessage', () => {
  it('mutates the stored conversation', () => {
    conversationRepository.insert(makeConversation({ id: 'c-update-1' }));
    const result = conversationRepository.updateLastMessage(
      'c-update-1',
      'hello',
      '2026-08-01T00:00:00.000Z',
    );
    expect(result?.lastMessage).toBe('hello');
    expect(conversationRepository.findById('c-update-1')?.updatedAt).toBe(
      '2026-08-01T00:00:00.000Z',
    );
  });

  it('returns undefined for an unknown conversation', () => {
    expect(conversationRepository.updateLastMessage('missing', 'x', 'x')).toBeUndefined();
  });
});
