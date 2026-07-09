import { describe, it, expect } from 'vitest';
import { messageThreadReducer } from '../model/MessageThread.reducer';
import type { Message, MessageCitation } from '../../../shared/entities/Message.types';

const pending: Message = {
  id: 'temp-ai-1',
  conversationId: 'c-1',
  content: '',
  sender: 'assistant',
  senderId: 'tutor-assistant',
  timestamp: '2026-01-01T00:00:00.000Z',
};

const citation: MessageCitation = {
  chunkId: 'kc-1',
  documentId: 'd1',
  documentName: 'x.md',
  chunkIndex: 0,
  score: 0.82,
};

describe('messageThreadReducer (streaming transitions)', () => {
  it('shows a progress status, then clears it on the first token', () => {
    let state = [pending];
    state = messageThreadReducer(state, {
      type: 'SET_ASSISTANT_STATUS',
      tempId: 'temp-ai-1',
      label: 'Searching your documents…',
    });
    expect(state[0].pendingStatus).toBe('Searching your documents…');

    state = messageThreadReducer(state, {
      type: 'APPEND_ASSISTANT_DELTA',
      tempId: 'temp-ai-1',
      delta: 'Hello',
    });
    expect(state[0].content).toBe('Hello');
    expect(state[0].pendingStatus).toBeUndefined();
  });

  it('stamps the persisted id and attaches citations on finish', () => {
    const state = messageThreadReducer([{ ...pending, content: 'Answer.' }], {
      type: 'FINISH_ASSISTANT',
      tempId: 'temp-ai-1',
      messageId: 'm-real',
      citations: [citation],
    });
    expect(state[0].id).toBe('m-real');
    expect(state[0].metadata?.citations).toEqual([citation]);
    expect(state[0].pendingStatus).toBeUndefined();
  });

  it('leaves metadata untouched when there are no citations (assistant/fallback)', () => {
    const state = messageThreadReducer([{ ...pending, content: 'Answer.' }], {
      type: 'FINISH_ASSISTANT',
      tempId: 'temp-ai-1',
      messageId: 'm-real',
      citations: [],
    });
    expect(state[0].id).toBe('m-real');
    expect(state[0].metadata).toBeUndefined();
  });
});
