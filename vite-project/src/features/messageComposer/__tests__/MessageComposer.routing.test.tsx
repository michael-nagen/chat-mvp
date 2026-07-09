import { describe, it, expect, vi, beforeEach } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import type { AiReplyDecision } from '../model/MessageComposer.api';

const { streamReply, showToast, selection, sendMock } = vi.hoisted(() => ({
  streamReply: vi.fn().mockResolvedValue(undefined),
  showToast: vi.fn(),
  selection: {
    current: {
      selectedConversationId: 'c-1',
      selectedConversation: {
        id: 'c-1',
        type: 'assistant',
        participants: [{ id: 'u-1' }, { id: 'ai-1' }],
      },
    },
  },
  sendMock: vi.fn(),
}));

vi.mock('../../chatPage/ChatSelection.context', () => ({
  useChatSelection: () => selection.current,
}));
vi.mock('../../messageThread', () => ({
  useMessageThread: () => ({
    addOptimisticMessage: vi.fn(),
    confirmMessage: vi.fn(),
    rollbackMessage: vi.fn(),
  }),
}));
vi.mock('../../assistantReply', () => ({ useAiReply: () => ({ streamReply }) }));
vi.mock('../../auth', () => ({ useAuth: () => ({ user: { id: 'u-1' } }) }));
vi.mock('../../toast', () => ({ useToast: () => ({ showToast }) }));
vi.mock('../model/MessageComposer.utils', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../model/MessageComposer.utils')>();
  return { ...actual, sendOptimisticMessage: sendMock };
});

import { useMessageComposer } from '../MessageComposer.use';

// Drives a send where the backend's routing decision (aiReply) is decoupled
// from the local conversation type, proving the composer obeys the response.
async function send({
  type,
  aiReply,
}: {
  type: string;
  aiReply: AiReplyDecision;
}): Promise<void> {
  selection.current = {
    selectedConversationId: 'c-1',
    selectedConversation: {
      id: 'c-1',
      type,
      participants: [{ id: 'u-1' }, { id: 'ai-1' }],
    },
  };
  sendMock.mockResolvedValue({ ok: true, aiReply });
  const { result } = renderHook(() => useMessageComposer());
  act(() => result.current.onChange('hello'));
  await act(async () => {
    result.current.handleSubmit({ preventDefault: vi.fn() } as never);
  });
}

beforeEach(() => {
  streamReply.mockClear();
  showToast.mockClear();
  sendMock.mockReset();
});

describe('useMessageComposer AI-reply routing', () => {
  it('streams when the send response requires an assistant reply', async () => {
    await send({ type: 'assistant', aiReply: { required: true, conversationType: 'assistant' } });
    await waitFor(() =>
      expect(streamReply).toHaveBeenCalledWith({ conversationId: 'c-1', aiSenderId: 'ai-1' }),
    );
  });

  it('streams when the send response requires a tutor reply', async () => {
    await send({ type: 'tutor', aiReply: { required: true, conversationType: 'tutor' } });
    await waitFor(() =>
      expect(streamReply).toHaveBeenCalledWith({ conversationId: 'c-1', aiSenderId: 'ai-1' }),
    );
  });

  it('does not stream when the send response requires no AI reply', async () => {
    await send({ type: 'dm', aiReply: { required: false } });
    await new Promise((r) => setTimeout(r, 0));
    expect(streamReply).not.toHaveBeenCalled();
  });

  it('obeys the send response over the local type: streams even when type is dm', async () => {
    await send({ type: 'dm', aiReply: { required: true, conversationType: 'assistant' } });
    await waitFor(() =>
      expect(streamReply).toHaveBeenCalledWith({ conversationId: 'c-1', aiSenderId: 'ai-1' }),
    );
  });

  it('obeys the send response over the local type: does not stream even when type is assistant', async () => {
    await send({ type: 'assistant', aiReply: { required: false } });
    await new Promise((r) => setTimeout(r, 0));
    expect(streamReply).not.toHaveBeenCalled();
  });
});
