import { describe, expect, it } from 'vitest';
import { conversationService } from '../conversations.service';

describe('conversationService.getForUser', () => {
  it('returns only conversations the user participates in', () => {
    const forU1 = conversationService.getForUser('u1');
    expect(forU1.length).toBeGreaterThanOrEqual(2);
    expect(forU1.every((c) => c.participantIds.includes('u1'))).toBe(true);
  });

  it('returns conversations sorted by updatedAt, newest first', () => {
    const result = conversationService.getForUser('u1');
    const times = result.map((c) => new Date(c.updatedAt).getTime());
    const sorted = [...times].sort((a, b) => b - a);
    expect(times).toEqual(sorted);
  });

  it('returns an empty array for a user with no conversations', () => {
    expect(conversationService.getForUser('ghost')).toEqual([]);
  });
});

describe('conversationService.createConversation', () => {
  it('creates a conversation owned by the user and persists it', () => {
    const created = conversationService.createConversation({ title: 'Brand new', userId: 'u1' });

    expect(created.title).toBe('Brand new');
    expect(created.participantIds).toEqual(['u1']);
    expect(created.lastMessage).toBe('');
    expect(created.id).toMatch(/^c-/);
    expect(conversationService.getById(created.id)).toEqual(created);
  });
});

describe('conversationService.updateLastMessage', () => {
  it('updates the preview and timestamp of an existing conversation', () => {
    const updatedAt = '2026-07-01T00:00:00.000Z';
    const result = conversationService.updateLastMessage('c2', 'Latest!', updatedAt);
    expect(result?.lastMessage).toBe('Latest!');
    expect(result?.updatedAt).toBe(updatedAt);
  });

  it('returns undefined when the conversation does not exist', () => {
    expect(conversationService.updateLastMessage('missing', 'x', 'x')).toBeUndefined();
  });
});
