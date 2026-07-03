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

  it('has no metadata when the raw message has none', () => {
    expect(toMessage({ raw, currentUserId: 'u1' }).metadata).toBeUndefined();
  });

  it('passes citation metadata through (refs only, with chunkId)', () => {
    const withCitations: RawMessage = {
      ...raw,
      metadata: {
        citations: [
          {
            chunkId: 'kc-1',
            documentId: 'd1',
            documentName: 'doc.md',
            chunkIndex: 0,
            score: 0.82,
          },
        ],
      },
    };
    expect(toMessage({ raw: withCitations, currentUserId: 'u2' }).metadata).toEqual({
      citations: [
        {
          chunkId: 'kc-1',
          documentId: 'd1',
          documentName: 'doc.md',
          chunkIndex: 0,
          score: 0.82,
        },
      ],
    });
  });

  it('passes knowledge_upload event metadata through', () => {
    const uploadEvent: RawMessage = {
      ...raw,
      senderId: 'tutor-assistant',
      content: 'Uploaded knowledge file: rag-test.md',
      metadata: {
        kind: 'knowledge_upload',
        documentId: 'kd-1',
        documentName: 'rag-test.md',
        status: 'completed',
      },
    };
    expect(toMessage({ raw: uploadEvent, currentUserId: 'u1' }).metadata).toEqual({
      kind: 'knowledge_upload',
      documentId: 'kd-1',
      documentName: 'rag-test.md',
      status: 'completed',
    });
  });
});
