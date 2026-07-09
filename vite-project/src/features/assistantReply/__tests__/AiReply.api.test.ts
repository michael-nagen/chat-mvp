import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { SseEvent } from '../../../shared/api/sseClient';

// Capture the frames pushed by each test and replay them through streamAiReply's
// onEvent handler, so we test the token/progress/done/error mapping in isolation.
const frames: SseEvent[] = [];

vi.mock('../../../shared/api/sseClient', () => ({
  streamEvents: vi.fn(
    async (_path: string, { onEvent }: { onEvent: (e: SseEvent) => void }) => {
      for (const frame of frames) onEvent(frame);
    },
  ),
}));

import { streamAiReply } from '../AiReply.api';

const frame = (event: string, data: unknown): SseEvent => ({
  event,
  data: JSON.stringify(data),
});

beforeEach(() => {
  frames.length = 0;
});

describe('streamAiReply', () => {
  it('maps progress/token/done and forwards tutor citations', async () => {
    const citation = {
      chunkId: 'kc-1',
      documentId: 'd1',
      documentName: 'x.md',
      chunkIndex: 0,
      score: 0.82,
    };
    frames.push(
      frame('progress', { label: 'Searching your documents…' }),
      frame('token', { delta: 'Grounded ' }),
      frame('token', { delta: 'answer.' }),
      frame('done', { messageId: 'm-1', citations: [citation] }),
    );

    const onProgress = vi.fn();
    const onToken = vi.fn();
    const onDone = vi.fn();
    await streamAiReply({
      conversationId: 'c-1',
      handlers: { onProgress, onToken, onDone },
    });

    expect(onProgress).toHaveBeenCalledWith('Searching your documents…');
    expect(onToken.mock.calls.map((c) => c[0])).toEqual(['Grounded ', 'answer.']);
    expect(onDone).toHaveBeenCalledWith('m-1', [citation]);
  });

  it('defaults citations to empty when done omits them (assistant)', async () => {
    frames.push(frame('token', { delta: 'Hi' }), frame('done', { messageId: 'm-2' }));

    const onDone = vi.fn();
    await streamAiReply({
      conversationId: 'c-1',
      handlers: { onToken: vi.fn(), onDone },
    });

    expect(onDone).toHaveBeenCalledWith('m-2', []);
  });

  it('handles a stream with no progress handler safely', async () => {
    frames.push(frame('progress', { label: 'x' }), frame('done', { messageId: 'm-3' }));

    const onDone = vi.fn();
    await expect(
      streamAiReply({ conversationId: 'c-1', handlers: { onToken: vi.fn(), onDone } }),
    ).resolves.toBeUndefined();
    expect(onDone).toHaveBeenCalledWith('m-3', []);
  });

  it('throws on an error event', async () => {
    frames.push(frame('error', { code: 'X', message: 'boom' }));

    await expect(
      streamAiReply({
        conversationId: 'c-1',
        handlers: { onToken: vi.fn(), onDone: vi.fn() },
      }),
    ).rejects.toThrow('boom');
  });
});
